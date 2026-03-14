using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class TaskUcesnici
    {
        public int Id { get; set; }
        public int idTask {  get; set; }

        public int idKorisnik { get; set; }

        public Taskovi Task { get; set; }

        public Korisnik Korisnik { get; set;}
    }
}
