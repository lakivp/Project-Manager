using api.Services.Interfaces;

namespace api.Services.Implementation
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _enviroment;

        public FileService(IWebHostEnvironment enviroment) 
        { 
            _enviroment = enviroment;
        }

        public async Task<Tuple<int, string>> SaveImage(IFormFile imageFile)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "../Uploads");

            var ext = Path.GetExtension(imageFile.FileName).ToLower();
            var allowedExtension = new string[] { ".jpg", ".png", ".jpeg" };

            if (!allowedExtension.Contains(ext))
            {
                string msg = string.Format("Nedozvoljenja ekstenzija");
                return new Tuple<int, string>(0, msg);
            }

            string uniqueString = Guid.NewGuid().ToString();

            var newFileName = uniqueString + ext;
            var fileWithPath = Path.Combine(path, newFileName);
            using (var stream = new FileStream(fileWithPath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            return new Tuple<int, string>(1, newFileName);
        }

        public bool DeleteImage(string imageFileName)
        {
            var wwwPath = _enviroment.WebRootPath;
            var path = Path.Combine(wwwPath, "Uploads/", imageFileName);
            if(File.Exists(path))
            {
                File.Delete(path);
                return true;
            }
            return false;
        }
    }
}
