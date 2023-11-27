using Microsoft.AspNetCore.Http;

namespace EMS.Users.Dto
{
    public class FileDto
    {
        public IFormFile file { get; set; }
        public string DriveUrl { get; set; }
    }
}
