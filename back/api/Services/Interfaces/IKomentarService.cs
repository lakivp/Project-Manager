using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface IKomentarService
    {
        Task<List<Komentar>> GetAllComments();

        Task<Komentar> GetCommentById(int id);

        Task<List<Komentar>> GetCommentsByAuthorId(int id);

        Task<List<Komentar>> GetCommentsByTaskId(int id);

        Task<List<Komentar>> GetRepliesOnComment(int id);

        Task<List<KomentarWithLikesDto>> GetCommentsByTaskIdWithLikes(int taskId, int userId);

        Task<List<KomentarWithLikesDto>> GetRepliesOnCommentWithLikes(int taskId, int userId);

        Task<Komentar> AddComment(KomentarAddDto komentar);

        Task<Komentar> UpdateComment(KomentarUpdateDto komentar);

        Task<Komentar> DeleteComment(int id);

        Task<bool> LikeCommentToggle(int id_komentara, int id_korisnika);
    }
}
