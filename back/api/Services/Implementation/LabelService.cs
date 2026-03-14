using api.Models;
using api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using static Google.Protobuf.Reflection.FieldDescriptorProto.Types;

namespace api.Services.Implementation
{
    public class LabelService : ILabelService
    {
        private readonly ProjectManagementContext _context;

        public LabelService(ProjectManagementContext context)
        {
            _context = context;
        }

        public async Task<List<Models.Label>> GetLabels()
        {
            var labels = await _context.ListaLabela.ToListAsync();

            return labels;
        }

        public async Task<Models.Label> GetLabelById(int id)
        {
            var label = await _context.ListaLabela.FindAsync(id);

            return label;
        }
 
        public async Task<Models.Label> AddLabel(Models.Dtos.LabelDto label)
        {
            Models.Label noviLabel = new Models.Label();
            noviLabel.naziv = label.naziv;
            noviLabel.idProjekat = label.idProjekat;
            _context.ListaLabela.Add(noviLabel);
            await _context.SaveChangesAsync();

            //label order
            var order = _context.ListaLabelRedosled.Where(x=> x.idProjekat == noviLabel.idProjekat).FirstOrDefault();
            
            var label_ids = order.order.Split(".").ToList();
            label_ids.Add(noviLabel.id.ToString());
            order.order = String.Join(".", label_ids);

            _context.ListaLabelRedosled.Update(order);
            await _context.SaveChangesAsync();


            return noviLabel;
        }

        public async Task<Models.Label> UpdateLabel(Models.Label label)
        {
            _context.ListaLabela.Update(label);

            await _context.SaveChangesAsync();

            return label;
        }

        public async Task<Models.Label> DeleteLabel(Models.Label label)
        {
            _context.ListaLabela.Remove(label);

            await _context.SaveChangesAsync();

            //label order
            var order = _context.ListaLabelRedosled.Where(x => x.idProjekat == label.idProjekat).FirstOrDefault();

            var label_ids = order.order.Split(".").ToList();
            label_ids.Remove(label.id.ToString());
            order.order = String.Join(".", label_ids);

            _context.ListaLabelRedosled.Update(order);
            await _context.SaveChangesAsync();

            return label;
        }

        public async Task<List<Models.Label>> GetLabelsByProjectId(int projectId)
        {
            var labele = await _context.ListaLabela.Where(id => id.idProjekat == projectId).ToListAsync();

            return labele;

        }

        public async Task<List<Models.Label>> GetLabelsByProjectIdOrdered(int projectId)
        {
            var labele = await _context.ListaLabela.Where(id => id.idProjekat == projectId).ToListAsync();

            var order = _context.ListaLabelRedosled.Where(x => x.idProjekat == projectId).FirstOrDefault();
            var label_ids = order.order.Split(".").ToList();

            List<Models.Label> labele_ordered = new List<Models.Label>();
            foreach (var label_id in label_ids)
            {
                var item = labele.Where(x => x.id == Int32.Parse(label_id)).FirstOrDefault();
                labele_ordered.Add(item);
            }

            return labele_ordered;

        }

        public async Task<bool> UpdateLabelOrderString(int projectId, string new_order) 
        {
            var order = _context.ListaLabelRedosled.Where(x => x.idProjekat == projectId).FirstOrDefault();
            order.order = new_order;

            _context.ListaLabelRedosled.Update(order);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
