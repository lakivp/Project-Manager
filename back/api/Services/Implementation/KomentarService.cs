using api.Models;
using api.Models.Dtos;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Implementation
{
    public class KomentarService : IKomentarService
    {
        private readonly ProjectManagementContext _context;

        public KomentarService(ProjectManagementContext context)
        {
            _context = context;
        }

        public async Task<List<Komentar>> GetAllComments()
        {
            var komentari = await _context.ListaKomentara.ToListAsync();

            return komentari;
        }

        public async Task<Komentar> GetCommentById(int id)
        {
            var komentar = await _context.ListaKomentara.FindAsync(id);

            return komentar;
        }

        public async Task<List<Komentar>> GetCommentsByAuthorId(int autorId)
        {
            var komentari = await _context.ListaKomentara.Where(x => x.autorId == autorId).ToListAsync();

            return komentari;
        }

        public async Task<List<Komentar>> GetCommentsByTaskId(int taskId)
        {
            var komentari = await _context.ListaKomentara.Where(x => x.taskId == taskId).ToListAsync();

            return komentari;
        }

        public async Task<List<Komentar>> GetRepliesOnComment(int parentId)
        {
            var komentari = await _context.ListaKomentara.Where(x => x.parentId == parentId).ToListAsync();

            return komentari;
        }

        public async Task<List<KomentarWithLikesDto>> GetCommentsByTaskIdWithLikes(int taskId, int userId)
        {
            var likes = await _context.Likes.ToListAsync();

            var result = await (
                from komentar in _context.ListaKomentara
                     .Where(komentar => komentar.taskId == taskId)

                select new KomentarWithLikesDto()
                {
                    id = komentar.id,
                    text = komentar.text,
                    autorId = komentar.autorId,
                    taskId = komentar.taskId,
                    parentId = komentar.parentId,
                    likes = CountLikes(komentar.id, likes),
                    liked_by_user = false
                }
                ).ToListAsync();

            for (int i = 0; i < result.Count; i++)
            {
                List<Like> user_like = await _context.Likes.Where(x => x.korisnikId == userId && x.komentarId == result[i].id).ToListAsync();
                if (user_like.Count != 0)
                {
                    result[i].liked_by_user = true;
                }
            }

            return result;
        }

        public async Task<List<KomentarWithLikesDto>> GetRepliesOnCommentWithLikes(int parentId, int userId)
        {
            var likes = await _context.Likes.ToListAsync();

            var result = await (
                from komentar in _context.ListaKomentara
                     .Where(komentar => komentar.parentId == parentId)

                select new KomentarWithLikesDto()
                {
                    id = komentar.id,
                    text = komentar.text,
                    autorId = komentar.autorId,
                    taskId = komentar.taskId,
                    parentId = komentar.parentId,
                    likes = CountLikes(komentar.id, likes),
                    liked_by_user = false
                }
                ).ToListAsync();

            for (int i = 0; i < result.Count; i++)
            {
                List<Like> user_like = await _context.Likes.Where(x => x.korisnikId == userId && x.komentarId == result[i].id).ToListAsync();
                if (user_like.Count != 0)
                {
                    result[i].liked_by_user = true;
                }
            }

            return result;
        }

        public async Task<Komentar> AddComment(KomentarAddDto komentarZahtev)
        {
            var komentar = new Komentar();

            komentar.text = komentarZahtev.text;
            komentar.autorId = komentarZahtev.autorId;
            komentar.taskId = komentarZahtev.taskId;
            komentar.parentId = komentarZahtev.parentId;

            _context.ListaKomentara.Add(komentar);

            await _context.SaveChangesAsync();

            return komentar;
        }

        public async Task<Komentar> UpdateComment(KomentarUpdateDto komentarZahtev)
        {
            var komentar = await _context.ListaKomentara.FindAsync(komentarZahtev.id);

            komentar.text = komentarZahtev.text;

            _context.ListaKomentara.Update(komentar);

            await _context.SaveChangesAsync();

            return komentar;

        }

        public async Task<Komentar> DeleteComment(int id)
        {
            var komentar = await _context.ListaKomentara.FindAsync(id);

            _context.ListaKomentara.Remove(komentar);

            await _context.SaveChangesAsync();

            return komentar;
        }

        public async Task<bool> LikeCommentToggle(int id_komentara, int id_korisnika)
        {
            
            var komentar = await _context.Likes.FirstOrDefaultAsync(x => x.komentarId == id_komentara && x.korisnikId == id_korisnika);

            if(komentar == null) // if no like exists then add
            {
                var temp = new Like();
                temp.komentarId = id_komentara;
                temp.korisnikId = id_korisnika;

                _context.Likes.Add(temp);
                await _context.SaveChangesAsync();
                
                return true;
            }
            else // otherwise remove existing
            {
                _context.Likes.Remove(komentar);
                await _context.SaveChangesAsync();
            }

            return false;
        }

        public static int CountLikes(int id_komentara, List<Like> likes)
        {
            return likes.Count(x => x.komentarId == id_komentara);
        }
    }
}
