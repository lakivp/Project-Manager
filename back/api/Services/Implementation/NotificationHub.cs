using api.Models;
using api.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Configuration;

namespace api.Services.Implementation
{
    public class NotificationHub : Hub<INotificationClient>
    {
        //IConfiguration _configuration;
        private readonly string _secretKey = "my top secret key for jwt token get"; // Make sure to store and retrieve this securely

        public NotificationHub(/*IConfiguration configuration*/)
        {
            /*_configuration = configuration;
            _secretKey = configuration.GetSection("Token").Value;*/
        }


        public static ConcurrentDictionary<string, List<string>> UserConnections = new ConcurrentDictionary<string, List<string>>();

        public static string DecodeJwtToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken != null)
            {
                var usernameClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
                if (usernameClaim != null)
                {
                    return usernameClaim.Value;
                }
            }
            return null;
        }

        public bool ValidateJwtToken(string token)
        {
            //Console.WriteLine("my key = " + _secretKey);
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                RequireExpirationTime = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return false;
            }
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var token = httpContext?.Request.Query["token"].FirstOrDefault();

            if (string.IsNullOrEmpty(token) || !ValidateJwtToken(token))
            {
                Console.WriteLine("Invalid token received during connection");
                Context.Abort();
                return;
            }

            var username = DecodeJwtToken(token);

            if (username != null)
            {
                var existingUserConnectionIds = UserConnections.GetOrAdd(username, _ => new List<string>());

                lock (existingUserConnectionIds)
                {
                    existingUserConnectionIds.Add(Context.ConnectionId);
                }

                Console.WriteLine($"User {username} connected with connection ID {Context.ConnectionId}");
                await Clients.Client(Context.ConnectionId).ReceiveNotification($"Connected users: {string.Join(", ", UserConnections.Keys)}");
            }
            else
            {
                Console.WriteLine("Failed to decode username from JWT token.");
                Context.Abort();
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var httpContext = Context.GetHttpContext();
            var token = httpContext?.Request.Query["token"].FirstOrDefault();
            var username = DecodeJwtToken(token);

            if (username != null)
            {
                if (UserConnections.TryGetValue(username, out var existingUserConnectionIds))
                {
                    lock (existingUserConnectionIds)
                    {
                        existingUserConnectionIds.Remove(Context.ConnectionId);
                    }

                    if (existingUserConnectionIds.Count == 0)
                    {
                        UserConnections.TryRemove(username, out _);
                    }
                }

                Console.WriteLine($"User {username} disconnected with connection ID {Context.ConnectionId}");
            }
            else
            {
                Console.WriteLine("User with the given username not found during disconnection");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
