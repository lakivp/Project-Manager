using api.Models;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Implementation
{
    public class DokumentacijaTaskovaService : IDokumentacijaTaskovaService
    {
        private readonly ProjectManagementContext _context;

        private readonly string[] allowedFileExtensions = new[] {
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", "svg",
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt",
        };

        private readonly int MAX_FILESIZE = 10_485_760;

        public DokumentacijaTaskovaService(ProjectManagementContext context)
        {
            _context = context;
        }

        public bool IssueDocumentationDirectoryExist()
        {
            if (Directory.Exists("../Uploads/Documents"))
                return true;
            return false;
        }

        private bool AllFilesOK(List<IFormFile> files)
        {
            foreach (IFormFile fileItem in files)
            {
                if (fileItem.Length <= 0)
                    return false;

                if (fileItem.Length > MAX_FILESIZE)
                    return false;

                var extension = Path.GetExtension(fileItem.FileName).ToLower();
                if (!allowedFileExtensions.Contains(extension))
                    return false;
            }

            return true;
        }

        public async Task<IEnumerable<DokumentacijaTaskova>> GetDocumentationForIssue(int taskId)
        {
            // Console.WriteLine("ISSUE ID  " + taskId);
            var result = await _context.ListaDokumentacijaTaskova.Where(doc => doc.taskId == taskId).ToListAsync();
            return result;

        }

        public async Task<string> WriteMultipleFilesAsync(int taskId, List<IFormFile> files)
        {
            var filesOK = AllFilesOK(files);
            if (!filesOK)
                return "Files are not valid for upload";

            var arr = new List<DokumentacijaTaskova>();
            foreach (IFormFile fileItem in files)
            {
                var extension = Path.GetExtension(fileItem.FileName).ToLower();


                var fileName = Path.GetFileNameWithoutExtension(fileItem.FileName);
                fileName = Path.GetInvalidFileNameChars().Aggregate(
                    fileName,
                    (current, c) => current.Replace(c.ToString(), string.Empty)
                );
                fileName = fileName.Replace(" ", "_");

                var uniqueFileName = $"{fileName}_{DateTime.Now.Ticks}{extension}";
                var filePath = "../Uploads/Documents/" + uniqueFileName;

                arr.Add(new DokumentacijaTaskova
                {
                    Naslov = fileName + extension,
                    Putanja = filePath,
                    taskId = taskId,
                    DateUploaded = DateTime.Now
                });

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await fileItem.CopyToAsync(stream);
                }


                File.SetAttributes(filePath, FileAttributes.ReadOnly | FileAttributes.NotContentIndexed);
            }

            await _context.ListaDokumentacijaTaskova.AddRangeAsync(arr);
            await _context.SaveChangesAsync();

            return "OK";
        }

        public async Task<bool> DeleteDocument(int documentId)
        {
            var itemToDelete = await _context.ListaDokumentacijaTaskova.FirstOrDefaultAsync(doc => doc.Id == documentId);
            if (itemToDelete == null)
                return false;

            var documentPath = itemToDelete.Putanja;

            _context.ListaDokumentacijaTaskova.Remove(itemToDelete);
            await _context.SaveChangesAsync();

            try
            {

                if (!string.IsNullOrEmpty(documentPath) && File.Exists(documentPath))
                {
                    File.SetAttributes(documentPath, File.GetAttributes(documentPath) & ~FileAttributes.ReadOnly);
                    File.Delete(documentPath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
                return false;
            }

            return true;
        }

        public async Task<DokumentacijaTaskova> GetDocumentById(int documentId)
        {
            return await _context.ListaDokumentacijaTaskova.FirstOrDefaultAsync(d => d.Id == documentId);
        }
    }
}
