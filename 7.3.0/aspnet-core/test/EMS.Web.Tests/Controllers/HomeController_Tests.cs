using System.Threading.Tasks;
using EMS.Models.TokenAuth;
using EMS.Web.Controllers;
using Shouldly;
using Xunit;

namespace EMS.Web.Tests.Controllers
{
    public class HomeController_Tests: EMSWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}