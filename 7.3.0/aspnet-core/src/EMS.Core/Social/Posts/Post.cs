using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Classes;
using EMS.Homeworks;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Social.Posts
{
    [Table("AbpPosts")]
    public class Post : FullAuditedEntity<long>
    {
        [ForeignKey("Class")]
        public long ClassId { get; set; }
        public Class Class { get; set; }
        public string Title { get; set; }
        public string ContentPost { get; set; }
        public TypePost Type { get; set; }
        public string FileKey { get; set; }
        public Homework Homework { get; set; }
        /*      Có trong FullAuditedEntity
         *      public long FromUser { get; set; }
                public DateTime Time { get; set; }*/

    }

    public enum TypePost
    {
        Homework,
        Disscus
    }

}
