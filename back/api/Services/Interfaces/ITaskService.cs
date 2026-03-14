using api.Models;
using api.Models.Dtos;

namespace api.Services.Interfaces
{
    public interface ITaskService
    {
        Task<List<Taskovi>> GetAllTasks();

        Task<Taskovi> GetTaskById(int id);

        Task<Taskovi> AddTask(TaskoviDto task);

        Task<Taskovi> UpdateTask(TaskoviDto task);

        Task<Taskovi> DeleteTask(int id);

        Task<Taskovi> CloseTask(int id);

        Task<List<GetTasksDto>> GetActiveTasks();

        Task<List<GetTasksDto>> GetInActiveTasks();

        Task<List<GetTasksDto>> GetTasksByProjekatId(int projekatId);

        Task<List<TaskUcesnici>> GetMembersByTaskId(int taskId);

        Task<TaskUcesniciDto> AddMember(TaskUcesniciDto input);
        
        Task<bool> RemoveMember(int task_id, int user_id);

        Task<List<GetTasksDto>> GetTasksByKorisnikId(int korisnikId);

        Task<List<GetTasksDto>> GetAllTasksWithLabelNames();

        Task<List<GetTasksDto>> GetTask(int id);

        Task<List<GetTasksDto>> GetFilteredTasks(FilterTaskDto filter,int projakatId);
        Task<List<GetTasksDto>> GetToDoTable(FilterTaskDto filter, int korisnikId);

        Task<HistogramTaskovaDto> GetHistogramTaskova(int korisnikId, int projekatId);

        Task<List<HistogramTaskovaDto>> GetHistogramTaskovaByProjectId(int projekatId);

    }
}
