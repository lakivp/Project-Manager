namespace api.Models.Dtos
{
    public class KomentarAddDto
    {
        public string text { get; set; }

        public int autorId { get; set; }

        public int taskId { get; set; }

        public int? parentId { get; set; }
    }
}
