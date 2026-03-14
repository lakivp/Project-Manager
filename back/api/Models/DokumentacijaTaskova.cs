using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class DokumentacijaTaskova
    {
        public int Id { get; set; }
        public string Naslov { get; set; }
        public string Putanja { get; set; }
        public int taskId { get; set; }
        public DateTime DateUploaded { get; set; }

        public Taskovi task { get; set; }
    }
}
