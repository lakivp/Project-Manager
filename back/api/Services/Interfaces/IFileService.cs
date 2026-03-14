namespace api.Services.Interfaces
{
    public interface IFileService
    {
        public Task<Tuple<int, string>> SaveImage(IFormFile imageFile);

        public bool DeleteImage(string imageFileName);
    }
}
