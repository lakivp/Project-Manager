using api.Models;

namespace api.Services.Interfaces
{
    public interface IDokumentacijaTaskovaService
    {
        bool IssueDocumentationDirectoryExist();
        Task<string> WriteMultipleFilesAsync(int issueId, List<IFormFile> files);
        Task<bool> DeleteDocument(int documentId);
        Task<IEnumerable<DokumentacijaTaskova>> GetDocumentationForIssue(int issueId);
        Task<DokumentacijaTaskova> GetDocumentById(int documentId);
    }
}
