namespace api.Models
{
    public class ZavisnostTask
    {
        public int id { get; set; }

        public int sourceId { get; set; }

        public int targetId { get; set; }

        public int type { get; set; }

        public Taskovi task {  get; set; }

        public Taskovi task1 { get; set; }

        public ZavisnostType zavisnost { get; set; }
    }
}
