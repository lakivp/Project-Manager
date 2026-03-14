using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace api.Models
{
    public class ProjectManagementContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public ProjectManagementContext(IConfiguration configuration) 
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("server");
        }

        public ProjectManagementContext(DbContextOptions<ProjectManagementContext> options) : base(options)
        {
        }

        public virtual DbSet<Korisnik> Korisnici { get; set; }
        public virtual DbSet<Label> ListaLabela { get; set; }
        public virtual DbSet<Obavestenje> Obavestenja { get; set; }
        public virtual DbSet<ObavestenjeKorisnik> ListaObavestenjeKorisnik { get; set; }
        public virtual DbSet<Projekat> Projekti { get; set; }
        public virtual DbSet<Taskovi> Tasks { get; set; }
        public virtual DbSet<TaskUcesnici> ListaTaskUcesnici { get; set; }
        public virtual DbSet<UlogaKorisnikProjekat> ListaUlogaKorisnikProjekat { get; set; }
        public virtual DbSet<UlogaProjekat> ListaUlogaProjekat { get; set; }
        public virtual DbSet<UlogeAplikacija> ListaUlogeAplikacija { get; set; }

        public virtual DbSet<Komentar> ListaKomentara { get; set; }

        public virtual DbSet<Tema> ListaTema { get; set; }

        public virtual DbSet<Podesavanja> ListaPodesavanja {  get; set; }

        public virtual DbSet<UserResetPassToken> ListaUserResetToken { get; set; }

        public virtual DbSet<ZavisnostTask> listaZavisnostiTaskova {  get; set; }
        
        public virtual DbSet<LabelRedosled> ListaLabelRedosled { get; set; }

        public virtual DbSet<ZavisnostType> ListaZavisnostiType {  get; set; }

        public virtual DbSet<Like> Likes {  get; set; }

        public virtual DbSet<DokumentacijaTaskova> ListaDokumentacijaTaskova { get; set; }

        public virtual DbSet<NaslovDokument> listaDokumenata { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL(_connectionString);
        }


        //MOGUCE DA CE TREBATI DA SE ISPISE
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Taskovi>(entity =>
            {
                entity.HasOne(e => e.projekat)
                .WithMany()
                .HasForeignKey(e => e.idProjekat)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.label)
                .WithMany()
                .HasForeignKey(e => e.idLabel)
                .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<DokumentacijaTaskova>(entity =>
            {
                entity.HasOne(e => e.task)
                .WithMany()
                .HasForeignKey(e => e.taskId);
            });

            modelBuilder.Entity<TaskUcesnici>(entity =>
            {
                entity.HasOne(e => e.Task)
                .WithMany()
                .HasForeignKey(e => e.idTask);

                entity.HasOne(e => e.Korisnik)
                .WithMany()
                .HasForeignKey(e => e.idKorisnik);

            }
            );

            modelBuilder.Entity<Komentar>(entity =>
            {
                entity.HasOne(e => e.Korisnik)
                .WithMany()
                .HasForeignKey(e => e.autorId);

                entity.HasOne(e => e.Task)
                .WithMany()
                .HasForeignKey(e => e.taskId);
            });

            modelBuilder.Entity<ObavestenjeKorisnik>(entity =>
            {
                entity.HasOne(e => e.korisnik)
                .WithMany()
                .HasForeignKey(e => e.idKorisnik);

                entity.HasOne(e => e.obavestenje)
                .WithMany()
                .HasForeignKey(e => e.idObavestenje);
            });

            modelBuilder.Entity<UlogaKorisnikProjekat>(entity =>
            {
                entity.HasOne(e => e.projekat)
                .WithMany()
                .HasForeignKey(e => e.idProjekat);

                entity.HasOne(e => e.korisnik)
                .WithMany()
                .HasForeignKey(e => e.idKorisnik);

                entity.HasOne(e => e.uloga)
                .WithMany()
                .HasForeignKey(e => e.idUloga);
            });

            modelBuilder.Entity<Label>(entity =>
            {
                entity.HasOne(e => e.projekat)
                .WithMany()
                .HasForeignKey(e => e.idProjekat);
            });

            modelBuilder.Entity<ZavisnostTask>(entity =>
            {
                entity.HasOne(e => e.task)
                .WithMany()
                .HasForeignKey(e => e.sourceId);

                entity.HasOne(e => e.task1)
                .WithMany()
                .HasForeignKey(e => e.targetId);

                entity.HasOne(e => e.zavisnost)
                .WithMany()
                .HasForeignKey(e => e.type);
            });

            modelBuilder.Entity<Podesavanja>(entity =>
            {
                entity.HasOne(e => e.korisnik)
                .WithMany()
                .HasForeignKey(e => e.korisnikId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.tema)
                .WithMany()
                .HasForeignKey(e => e.temaId);
            });

            modelBuilder.Entity<Tema>(entity =>
            {
                entity.HasOne(e => e.korisnik)
                .WithMany()
                .HasForeignKey(e => e.korisnikId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Obavestenje>(entity =>
            {
                entity.Property(e => e.dateCreated).HasColumnType("datetime");
            });

            modelBuilder.Entity<LabelRedosled>(entity =>
            {
                entity.HasOne(e => e.projekat)
                .WithMany()
                .HasForeignKey(e => e.idProjekat);
            });

            modelBuilder.Entity<Like>(entity =>
            {
                entity.HasOne(e => e.Korisnik)
                .WithMany()
                .HasForeignKey(e => e.korisnikId);

                entity.HasOne(e => e.Komentar)
                .WithMany()
                .HasForeignKey(e => e.komentarId);
            });
        }






    }
}
