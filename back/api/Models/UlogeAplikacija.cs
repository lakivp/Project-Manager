using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    [Keyless]
    public class UlogeAplikacija
    {
        public int id {  get; set; }

        public string naziv {  get; set; }
    }
}
