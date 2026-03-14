using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Label
    {
        public int id {  get; set; }

        public string naziv { get; set; }

        public int idProjekat { get; set; }

        public Projekat projekat { get; set; }
    }
}
