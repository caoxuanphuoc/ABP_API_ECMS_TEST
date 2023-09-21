using System.ComponentModel.DataAnnotations;

namespace EMS.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}