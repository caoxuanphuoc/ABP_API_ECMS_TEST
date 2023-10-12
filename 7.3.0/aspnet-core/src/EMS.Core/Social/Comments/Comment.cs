using Abp.Domain.Entities.Auditing;
using EMS.Social.Posts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Social.Comments
{
    [Table("AbpComments")]
    public class Comment : FullAuditedEntity<long>
    {
        [ForeignKey("Post")]
        public long PostId { get; set; }
        public Post Post { get; set; }
        public bool IsPrivate { get; set; } = false;
        public string ContentComment { get; set; }
        // FullAuditedEntity đã có: public long UserSend { get; set; }

    }
}
