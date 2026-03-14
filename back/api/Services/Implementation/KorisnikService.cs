using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Tls.Crypto.Impl.BC;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace api.Services.Implementation
{
    public class KorisnikService : IKorisnikService
    {

        private readonly ProjectManagementContext _context;
        private readonly IConfiguration _configuration;

        public KorisnikService(ProjectManagementContext context, IConfiguration configuration) 
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<List<Korisnik>> GetAllKorisnici()
        {
            var korisnici  =  await _context.Korisnici.ToListAsync();

            return korisnici;
        }

        public async Task<Korisnik> GetKorisnikById(int id)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);

            return korisnik;
        }

        public async Task<Korisnik> GetKorisnikByUsername(string username)
        {
            var korisnik = await _context.Korisnici.FirstOrDefaultAsync(x => x.username == username);

            return korisnik;
        }

        public async Task<Korisnik> GetKorisnikByEmail(string email)
        {
            var korisnik = await _context.Korisnici.FirstOrDefaultAsync(x => x.email == email);

            return korisnik;
        }

        public async Task<Korisnik> AddKorisnik(Korisnik k)
        {
            _context.Korisnici.Add(k);

            await _context.SaveChangesAsync();

            return k;
        }

        public async Task<Korisnik> UpdateKorisnik(Korisnik k)
        {
            _context.Korisnici.Update(k);

            await _context.SaveChangesAsync();

            return k;
        }

        public async Task<Korisnik> DeleteKorisnik(Korisnik k)
        {
            _context.Korisnici.Remove(k);

            await _context.SaveChangesAsync();

            return k;
        }

        public async Task<List<Korisnik>> GetActiveKorisnici()
        {
            var korisnici = await  _context.Korisnici.ToListAsync();
            
            for(int i=0;i < korisnici.Count; i++) 
            {
                if (korisnici[i].status == 0)
                {
                    korisnici.RemoveAt(i);
                    i--;
                }
            }

            return korisnici;
            
        }

        public async Task<List<Korisnik>> GetInActiveKorisnici()
        {
            var korisnici = await _context.Korisnici.ToListAsync();

            for (int i = 0; i < korisnici.Count; i++)
            {
                if (korisnici[i].status == 1)
                {
                    korisnici.RemoveAt(i);
                    i--;
                }
            }

            return korisnici;

        }

        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public bool VerifyPasswordHash(string password,byte[] passwordHash,byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public string GetRoleByid(Korisnik korisnik)
        {
            if(korisnik.idUlogeAplikacija == 1)
            {
                return "admin";
            }
            else if(korisnik.idUlogeAplikacija == 2)
            {
                return "user";
            }
            else if (korisnik.idUlogeAplikacija == 4)
            {
                return "projectManager";
            }
            return "guest";
        }
        public async Task<Korisnik> UpdateUserProfilePhoto(string username, string photo)
        {
            var user = await _context.Korisnici.FirstOrDefaultAsync(x => x.username == username);

            if (user == null)
            {
                return null;
            }

            user.imageURL = photo;
            _context.Korisnici.Update(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public string CreateToken(Korisnik korisnik)
        {
            string role = GetRoleByid(korisnik);
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,korisnik.id.ToString(),ClaimValueTypes.Integer),
                new Claim(ClaimTypes.Name,korisnik.username),
                new Claim(ClaimTypes.Role,role)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                issuer: "http://localhost:5235",
                audience: "http://localhost:5235",
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
                
        }
    }
}
