using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Homeworks
{
    [Table("AbpSubmitHomeworks")]
    public class SubmitHomeWork : FullAuditedEntity<long>
    {
        [ForeignKey("Homework")]
        public long HomeworkId { get; set; }
        public Homework Homework { get; set; }
        public string Title { get; set; }
        public int Score { get; set; }
        public string Content { get; set; }
        public string FileKey { get; set; }
        public bool Islate { get; set; }
        /*  có trong FullAuditedEntity
         *  public DateTime SubmitTime { get; set; }
         *  public long FromUser { get; set; }
        */

    }
}
