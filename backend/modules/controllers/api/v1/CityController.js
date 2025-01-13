const Controller = require('../Controller')
const Country = require('country-state-city').Country;
const State = require('country-state-city').State;
const City = require('country-state-city').City;


module.exports = new class BrandController extends Controller{
    async getAllCountries(req, res){
     // const countries =   Country.getAllCountries()
     const countries = [
        {
          "name": "Afghanistan",
          "isoCode": "AF"
        },
        {
          "name": "Aland-Inseln",
          "isoCode": "AX"
        },
        {
          "name": "Albanien",
          "isoCode": "AL"
        },
        {
          "name": "Algerien",
          "isoCode": "DZ"
        },
        {
          "name": "Amerikanischen Samoa-Inseln",
          "isoCode": "AS"
        },
        {
          "name": "Andorra",
          "isoCode": "AD"
        },
        {
          "name": "Angola",
          "isoCode": "AO"
        },
        {
          "name": "Anguilla",
          "isoCode": "AI"
        },
        {
          "name": "Antarktis",
          "isoCode": "AQ"
        },
        {
          "name": "Antigua und Barbuda",
          "isoCode": "AG"
        },
        {
          "name": "Argentinien",
          "isoCode": "AR"
        },
        {
          "name": "Armenien",
          "isoCode": "AM"
        },
        {
          "name": "Aruba",
          "isoCode": "AW"
        },
        {
          "name": "Australien",
          "isoCode": "AU"
        },
        {
          "name": "Österreich",
          "isoCode": "AT"
        },
        {
          "name": "Aserbaidschan",
          "isoCode": "AZ"
        },
        {
          "name": "Die Bahamas",
          "isoCode": "BS"
        },
        {
          "name": "Bahrain",
          "isoCode": "BH"
        },
        {
          "name": "Bangladesch",
          "isoCode": "BD"
        },
        {
          "name": "Barbados",
          "isoCode": "BB"
        },
        {
          "name": "Weißrussland",
          "isoCode": "BY"
        },
        {
          "name": "Belgien",
          "isoCode": "BE"
        },
        {
          "name": "Belize",
          "isoCode": "BZ"
        },
        {
          "name": "Benin",
          "isoCode": "BJ"
        },
        {
          "name": "Bermuda",
          "isoCode": "BM"
        },
        {
          "name": "Bhutan",
          "isoCode": "BT"
        },
        {
          "name": "Bolivien",
          "isoCode": "BO"
        },
        {
          "name": "Bosnien und Herzegowina",
          "isoCode": "BA"
        },
        {
          "name": "Botswana",
          "isoCode": "BW"
        },
        {
          "name": "Bouvetinsel",
          "isoCode": "BV"
        },
        {
          "name": "Brasilien",
          "isoCode": "BR"
        },
        {
          "name": "Britisches Territorium des Indischen Ozeans",
          "isoCode": "IO"
        },
        {
          "name": "Brunei",
          "isoCode": "BN"
        },
        {
          "name": "Bulgarien",
          "isoCode": "BG"
        },
        {
          "name": "Burkina Faso",
          "isoCode": "BF"
        },
        {
          "name": "Burundi",
          "isoCode": "BI"
        },
        {
          "name": "Kambodscha",
          "isoCode": "KH"
        },
        {
          "name": "Kamerun",
          "isoCode": "CM"
        },
        {
          "name": "Kanada",
          "isoCode": "CA"
        },
        {
          "name": "Kap Verde",
          "isoCode": "CV"
        },
        {
          "name": "Cayman Inseln",
          "isoCode": "KY"
        },
        {
          "name": "Zentralafrikanische Republik",
          "isoCode": "CF"
        },
        {
          "name": "Tschad",
          "isoCode": "TD"
        },
        {
          "name": "Chile",
          "isoCode": "CL"
        },
        {
          "name": "China",
          "isoCode": "CN"
        },
        {
          "name": "Weihnachtsinsel",
          "isoCode": "CX"
        },
        {
          "name": "Kokosinseln (Keelinginseln).",
          "isoCode": "CC"
        },
        {
          "name": "Kolumbien",
          "isoCode": "CO"
        },
        {
          "name": "Komoren",
          "isoCode": "KM"
        },
        {
          "name": "Kongo",
          "isoCode": "CG"
        },
        {
          "name": "Demokratische Republik Kongo",
          "isoCode": "CD"
        },
        {
          "name": "Cookinseln",
          "isoCode": "CK"
        },
        {
          "name": "Costa Rica",
          "isoCode": "CR"
        },
        {
          "name": "Elfenbeinküste (Elfenbeinküste)",
          "isoCode": "CI"
        },
        {
          "name": "Kroatien",
          "isoCode": "HR"
        },
        {
          "name": "Kuba",
          "isoCode": "CU"
        },
        {
          "name": "Zypern",
          "isoCode": "CY"
        },
        {
          "name": "Tschechien",
          "isoCode": "CZ"
        },
        {
          "name": "Dänemark",
          "isoCode": "DK"
        },
        {
          "name": "Dschibuti",
          "isoCode": "DJ"
        },
        {
          "name": "Dominica",
          "isoCode": "DM"
        },
        {
          "name": "Dominikanische Republik",
          "isoCode": "DO"
        },
        {
          "name": "Osttimor",
          "isoCode": "TL"
        },
        {
          "name": "Ecuador",
          "isoCode": "EC"
        },
        {
          "name": "Ägypten",
          "isoCode": "EG"
        },
        {
          "name": "El Salvador",
          "isoCode": "SV"
        },
        {
          "name": "Äquatorialguinea",
          "isoCode": "GQ"
        },
        {
          "name": "Eritrea",
          "isoCode": "ER"
        },
        {
          "name": "Estland",
          "isoCode": "EE"
        },
        {
          "name": "Äthiopien",
          "isoCode": "ET"
        },
        {
          "name": "Falkland Inseln",
          "isoCode": "FK"
        },
        {
          "name": "Färöer Inseln",
          "isoCode": "FO"
        },
        {
          "name": "Fidschi-Inseln",
          "isoCode": "FJ"
        },
        {
          "name": "Finnland",
          "isoCode": "FI"
        },
        {
          "name": "Frankreich",
          "isoCode": "FR"
        },
        {
          "name": "Französisch-Guayana",
          "isoCode": "GF"
        },
        {
          "name": "Französisch Polynesien",
          "isoCode": "PF"
        },
        {
          "name": "Südfranzösische Territorien",
          "isoCode": "TF"
        },
        {
          "name": "Gabun",
          "isoCode": "GA"
        },
        {
          "name": "Gambia",
          "isoCode": "GM"
        },
        {
          "name": "Georgia",
          "isoCode": "GE"
        },
        {
          "name": "Deutschland",
          "isoCode": "DE"
        },
        {
          "name": "Ghana",
          "isoCode": "GH"
        },
        {
          "name": "Gibraltar",
          "isoCode": "GI"
        },
        {
          "name": "Griechenland",
          "isoCode": "GR"
        },
        {
          "name": "Grönland",
          "isoCode": "GL"
        },
        {
          "name": "Grenada",
          "isoCode": "GD"
        },
        {
          "name": "Guadeloupe",
          "isoCode": "Hausarzt"
        },
        {
          "name": "Guam",
          "isoCode": "GU"
        },
        {
          "name": "Guatemala",
          "isoCode": "GT"
        },
        {
          "name": "Guernsey und Alderney",
          "isoCode": "GG"
        },
        {
          "name": "Guinea",
          "isoCode": "GN"
        },
        {
          "name": "Guinea-Bissau",
          "isoCode": "GW"
        },
        {
          "name": "Guyana",
          "isoCode": "GY"
        },
        {
          "name": "Haiti",
          "isoCode": "HT"
        },
        {
          "name": "Heard-Insel und McDonald-Inseln",
          "isoCode": "HM"
        },
        {
          "name": "Honduras",
          "isoCode": "HN"
        },
        {
          "name": "Sonderverwaltungszone Hongkong.",
          "isoCode": "HK"
        },
        {
          "name": "Ungarn",
          "isoCode": "HU"
        },
        {
          "name": "Island",
          "isoCode": "IS"
        },
        {
          "name": "Indien",
          "isoCode": "IN"
        },
        {
          "name": "Indonesien",
          "isoCode": "ID"
        },
        {
          "name": "Iran",
          "isoCode": "IR"
        },
        {
          "name": "Irak",
          "isoCode": "IQ"
        },
        {
          "name": "Irland",
          "isoCode": "IE"
        },
        {
          "name": "Israel",
          "isoCode": "IL"
        },
        {
          "name": "Italien",
          "isoCode": "IT"
        },
        {
          "name": "Jamaika",
          "isoCode": "JM"
        },
        {
          "name": "Japan",
          "isoCode": "JP"
        },
        {
          "name": "Jersey",
          "isoCode": "JE"
        },
        {
          "name": "Jordanien",
          "isoCode": "JO"
        },
        {
          "name": "Kasachstan",
          "isoCode": "KZ"
        },
        {
          "name": "Kenia",
          "isoCode": "KE"
        },
        {
          "name": "Kiribati",
          "isoCode": "KI"
        },
        {
          "name": "Nord Korea",
          "isoCode": "KP"
        },
        {
          "name": "Südkorea",
          "isoCode": "KR"
        },
        {
          "name": "Kuwait",
          "isoCode": "KW"
        },
        {
          "name": "Kirgisistan",
          "isoCode": "KG"
        },
        {
          "name": "Laos",
          "isoCode": "LA"
        },
        {
          "name": "Lettland",
          "isoCode": "LV"
        },
        {
          "name": "Libanon",
          "isoCode": "LB"
        },
        {
          "name": "Lesotho",
          "isoCode": "LS"
        },
        {
          "name": "Liberia",
          "isoCode": "LR"
        },
        {
          "name": "Libyen",
          "isoCode": "LY"
        },
        {
          "name": "Liechtenstein",
          "isoCode": "LI"
        },
        {
          "name": "Litauen",
          "isoCode": "LT"
        },
        {
          "name": "Luxemburg",
          "isoCode": "LU"
        },
        {
          "name": "Sonderverwaltungszone Macau",
          "isoCode": "MO"
        },
        {
          "name": "Mazedonien",
          "isoCode": "MK"
        },
        {
          "name": "Madagaskar",
          "isoCode": "MG"
        },
        {
          "name": "Malawi",
          "isoCode": "MW"
        },
        {
          "name": "Malaysia",
          "isoCode": "MEIN"
        },
        {
          "name": "Malediven",
          "isoCode": "MV"
        },
        {
          "name": "Mali",
          "isoCode": "ML"
        },
        {
          "name": "Malta",
          "isoCode": "MT"
        },
        {
          "name": "Mann (Insel)",
          "isoCode": "IM"
        },
        {
          "name": "Marshallinseln",
          "isoCode": "MH"
        },
        {
          "name": "Martinique",
          "isoCode": "MQ"
        },
        {
          "name": "Mauretanien",
          "isoCode": "MR"
        },
        {
          "name": "Mauritius",
          "isoCode": "MU"
        },
        {
          "name": "Mayotte",
          "isoCode": "YT"
        },
        {
          "name": "Mexiko",
          "isoCode": "MX"
        },
        {
          "name": "Mikronesien",
          "isoCode": "FM"
        },
        {
          "name": "Moldawien",
          "isoCode": "MD"
        },
        {
          "name": "Monaco",
          "isoCode": "MC"
        },
        {
          "name": "Mongolei",
          "isoCode": "MN"
        },
        {
          "name": "Montenegro",
          "isoCode": "MICH"
        },
        {
          "name": "Montserrat",
          "isoCode": "MS"
        },
        {
          "name": "Marokko",
          "isoCode": "MA"
        },
        {
          "name": "Mosambik",
          "isoCode": "MZ"
        },
        {
          "name": "Myanmar",
          "isoCode": "MM"
        },
        {
          "name": "Namibia",
          "isoCode": "N / A"
        },
        {
          "name": "Nauru",
          "isoCode": "NR"
        },
        {
          "name": "Nepal",
          "isoCode": "NP"
        },
        {
          "name": "Bonaire, Sint Eustatius und Saba",
          "isoCode": "BQ"
        },
        {
          "name": "Niederlande",
          "isoCode": "NL"
        },
        {
          "name": "Neu-Kaledonien",
          "isoCode": "NC"
        },
        {
          "name": "Neuseeland",
          "isoCode": "NZ"
        },
        {
          "name": "Nicaragua",
          "isoCode": "NI"
        },
        {
          "name": "Niger",
          "isoCode": "NE"
        },
        {
          "name": "Nigeria",
          "isoCode": "NG"
        },
        {
          "name": "Niue",
          "isoCode": "NU"
        },
        {
          "name": "Norfolkinsel",
          "isoCode": "NF"
        },
        {
          "name": "Nördliche Marianneninseln",
          "isoCode": "MP"
        },
        {
          "name": "Norwegen",
          "isoCode": "NO"
        },
        {
          "name": "Oman",
          "isoCode": "OM"
        },
        {
          "name": "Pakistan",
          "isoCode": "PK"
        },
        {
          "name": "Palau",
          "isoCode": "PW"
        },
        {
          "name": "Besetzte palästinensische Gebiete",
          "isoCode": "PS"
        },
        {
          "name": "Panama",
          "isoCode": "PA"
        },
        {
          "name": "Papua Neu-Guinea",
          "isoCode": "PG"
        },
        {
          "name": "Paraguay",
          "isoCode": "PY"
        },
        {
          "name": "Peru",
          "isoCode": "SPORT"
        },
        {
          "name": "Philippinen",
          "isoCode": "PH"
        },
        {
          "name": "Pitcairninsel",
          "isoCode": "PN"
        },
        {
          "name": "Polen",
          "isoCode": "PL"
        },
        {
          "name": "Portugal",
          "isoCode": "PT"
        },
        {
          "name": "Puerto Rico",
          "isoCode": "PR"
        },
        {
          "name": "Katar",
          "isoCode": "QA"
        },
        {
          "name": "Wiedervereinigung",
          "isoCode": "RE"
        },
        {
          "name": "Rumänien",
          "isoCode": "RO"
        },
        {
          "name": "Russland",
          "isoCode": "RU"
        },
        {
          "name": "Ruanda",
          "isoCode": "RW"
        },
        {
          "name": "St. Helena",
          "isoCode": "SH"
        },
        {
          "name": "St. Kitts und Nevis",
          "isoCode": "KN"
        },
        {
          "name": "St. Lucia",
          "isoCode": "LC"
        },
        {
          "name": "Saint-Pierre und Miquelon",
          "isoCode": "PM"
        },
        {
          "name": "St. Vincent und die Grenadinen",
          "isoCode": "VC"
        },
        {
          "name": "Saint-Barthélemy",
          "isoCode": "BL"
        },
        {
          "name": "Saint-Martin (französischer Teil)",
          "isoCode": "MF"
        },
        {
          "name": "Samoa",
          "isoCode": "WS"
        },
        {
          "name": "San Marino",
          "isoCode": "SM"
        },
        {
          "name": "São Tomé und Príncipe",
          "isoCode": "ST"
        },
        {
          "name": "Saudi-Arabien",
          "isoCode": "SA"
        },
        {
          "name": "Senegal",
          "isoCode": "SN"
        },
        {
          "name": "Serbien",
          "isoCode": "RS"
        },
        {
          "name": "Seychellen",
          "isoCode": "SC"
        },
        {
          "name": "Sierra Leone",
          "isoCode": "SL"
        },
        {
          "name": "Singapur",
          "isoCode": "SG"
        },
        {
          "name": "Slowakei",
          "isoCode": "SK"
        },
        {
          "name": "Slowenien",
          "isoCode": "SI"
        },
        {
          "name": "Salomon-Inseln",
          "isoCode": "SB"
        },
        {
          "name": "Somalia",
          "isoCode": "ALSO"
        },
        {
          "name": "Südafrika",
          "isoCode": "ZA"
        },
        {
          "name": "Südgeorgien",
          "isoCode": "GS"
        },
        {
          "name": "Südsudan",
          "isoCode": "SS"
        },
        {
          "name": "Spanien",
          "isoCode": "ES"
        },
        {
          "name": "Sri Lanka",
          "isoCode": "LK"
        },
        {
          "name": "Sudan",
          "isoCode": "SD"
        },
        {
          "name": "Surinam",
          "isoCode": "SR"
        },
        {
          "name": "Spitzbergen und Jan-Mayen-Inseln",
          "isoCode": "SJ"
        },
        {
          "name": "Swasiland",
          "isoCode": "SZ"
        },
        {
          "name": "Schweden",
          "isoCode": "SE"
        },
        {
          "name": "Schweiz",
          "isoCode": "CH"
        },
        {
          "name": "Syrien",
          "isoCode": "SY"
        },
        {
          "name": "Taiwan",
          "isoCode": "TW"
        },
        {
          "name": "Tadschikistan",
          "isoCode": "TJ"
        },
        {
          "name": "Tansania",
          "isoCode": "TZ"
        },
        {
          "name": "Thailand",
          "isoCode": "TH"
        },
        {
          "name": "Gehen",
          "isoCode": "TG"
        },
        {
          "name": "Tokelau",
          "isoCode": "TK"
        },
        {
          "name": "Tonga",
          "isoCode": "ZU"
        },
        {
          "name": "Trinidad und Tobago",
          "isoCode": "TT"
        },
        {
          "name": "Tunesien",
          "isoCode": "TN"
        },
        {
          "name": "Truthahn",
          "isoCode": "TR"
        },
        {
          "name": "Turkmenistan",
          "isoCode": "TM"
        },
        {
          "name": "Turks- und Caicosinseln",
          "isoCode": "TC"
        },
        {
          "name": "Tuvalu",
          "isoCode": "Fernseher"
        },
        {
          "name": "Uganda",
          "isoCode": "UG"
        },
        {
          "name": "Ukraine",
          "isoCode": "UA"
        },
        {
          "name": "Vereinigte Arabische Emirate",
          "isoCode": "AE"
        },
        {
          "name": "Großbritannien",
          "isoCode": "GB"
        },
        {
          "name": "Vereinigte Staaten",
          "isoCode": "UNS"
        },
        {
          "name": "Kleinere vorgelagerte Inseln der Vereinigten Staaten",
          "isoCode": "UM"
        },
        {
          "name": "Uruguay",
          "isoCode": "UY"
        },
        {
          "name": "Usbekistan",
          "isoCode": "UZ"
        },
        {
          "name": "Vanuatu",
          "isoCode": "VU"
        },
        {
          "name": "Staat Vatikanstadt (Heiliger Stuhl)",
          "isoCode": "VA"
        },
        {
          "name": "Venezuela",
          "isoCode": "VE"
        },
        {
          "name": "Vietnam",
          "isoCode": "VN"
        },
        {
          "name": "Virgin Inseln, Britisch)",
          "isoCode": "VG"
        },
        {
          "name": "Jungferninseln (USA)",
          "isoCode": "VI"
        },
        {
          "name": "Wallis- und Futuna-Inseln",
          "isoCode": "WF"
        },
        {
          "name": "Westsahara",
          "isoCode": "EH"
        },
        {
          "name": "Jemen",
          "isoCode": "YE"
        },
        {
          "name": "Sambia",
          "isoCode": "ZM"
        },
        {
          "name": "Zimbabwe",
          "isoCode": "ZW"
        },
        {
          "name": "Kosovo",
          "isoCode": "XK"
        },
        {
          "name": "Curacao",
          "isoCode": "CW"
        },
        {
          "name": "Sint Maarten (niederländischer Teil)",
          "isoCode": "SX"
        }
      ]
       return res.json({
            success: true,
            data: countries
        })
    }

    async getStatesOfCountry(req, res){
        const country = req.params.country
        const states = State.getStatesOfCountry(country)
        return res.json({
            success: true,
            data : states
        })
    }

    async getCitiesOfCountry(req, res){
        const country = req.params.country
        const cities = City.getCitiesOfCountry(country)

        return res.json({
            success: true,
            data: cities
        })
    }
}