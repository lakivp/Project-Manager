namespace api.Models.Dtos
{
    public class KomentarWithLikesDto
    {
        public int id {  get; set; }
        public string text { get; set; }
        public int autorId { get; set; }
        public int taskId { get; set; }
        public int? parentId { get; set; }
        public int likes { get; set; }
        public bool liked_by_user { get; set; }
    }
}
