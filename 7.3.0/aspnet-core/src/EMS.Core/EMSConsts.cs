using EMS.Debugging;

namespace EMS
{
    public class EMSConsts
    {
        public const string LocalizationSourceName = "EMS";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "04fb99a7f42645f1b4cce4b2132be114";
    }
}
