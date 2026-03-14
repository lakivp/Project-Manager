namespace api.Models.Dtos
{
    public class AddMemberDto
    {
        public int task_id { get; set; } // id of a task or a project
        public int member_id { get; set; }
        public int role_id { get; set; }
    }
}
