using System.Reflection.Emit;

namespace api.Services.Interfaces
{
    public interface ILabelService
    {
        public Task<List<Models.Label>> GetLabels();

        public Task<Models.Label> GetLabelById(int id);

        public Task<Models.Label> AddLabel(Models.Dtos.LabelDto label);
        
        public Task<Models.Label> UpdateLabel(Models.Label label);

        public Task<Models.Label> DeleteLabel(Models.Label label);

        public Task<List<Models.Label>> GetLabelsByProjectId(int projectId);

        public Task<List<Models.Label>> GetLabelsByProjectIdOrdered(int projectId);

        public Task<bool> UpdateLabelOrderString(int projectId, string new_order);
    }
}
