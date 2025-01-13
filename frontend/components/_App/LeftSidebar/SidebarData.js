import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import LayersIcon from "@mui/icons-material/Layers";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddchartIcon from "@mui/icons-material/Addchart";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import {NoCrash} from "@mui/icons-material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const SidebarData = [
  {
    title: "home",
    path: "/dashboard/",
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

  },

  {
    title: "cars",
    path: "#",
    icon: <NoCrash />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      {
        title: "cars_list",
        path: "/cars/",
      },
      {
        title: "cars_gallery",
        path: "/cars/grid/",
      }
    ],
  },

  {
    title: "customers",
    path: "/customers/",
    icon: <PersonPinIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },


  {
    title: "deals",
    path: "#",
    icon: <LocalOfferIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "commission_agreement_invoice",
        path: "/comagree/",
      },
      {
        title: "purchase_with_warranty_invoice_menu",
        path: "/purchasewithwarranty/",
      },
      {
        title: "netto_invoice",
        path: "/nettoInvoice/",
      },
      {
        title: "dfz_invoice",
        path: "/dfzInvoice/",
      },
      {
        title: "mwst_invoice",
        path: "/mwstInvoice/",
      },
        ]
  },

  {
    title: "reports",
    path: "#",
    icon: <AddchartIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
        {
            title: "bank_report",
            path: "/reports/bank/",
        },
        {
            title: "cars_dynamic_report",
            path: "/reports/dynamiccars/",
        }
    ],

  },
  {
    title: "garage",
    path: "#",
    icon: <ShoppingCartCheckoutIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      {
        title: "models",
        path: "/models/",
      },
      {
        title: "colors",
        path: "/colors/",
      },
      {
        title: "brands",
        path: "/brands/",
      },
    ],
  },
  {
    title: "basic_info",
    path: "/basicinfo/update/653d05e98a263c6c3efe6678/",
    icon: <SettingsIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
 /* {
    title: "settings",
    path: "/settings/",
    icon: <SettingsIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },*/

];

/****************************************************************************************************/
//
//        **************  Here is the default SidebarData from the template ***************
//
/****************************************************************************************************/

export const SidebarDataDefault = [
  {
    title: "Dashboard",
    path: "/admash",
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "eCommerce",
        path: "/admash/ecommerce/",
      },
      {
        title: "Analytics",
        path: "/admash/analytics/",
      },
      {
        title: "Project Management",
        path: "/admash/project-management/",
      },
      {
        title: "LMS Courses",
        path: "/admash/lms-courses/",
      },
      {
        title: "Crypto",
        path: "/admash/crypto/",
      },
      {
        title: "Help/Support Desk",
        path: "/admash/help-desk/",
      },
      {
        title: "SaaS App",
        path: "/admash/saas-app/",
      },
    ],
  },
  {
    title: "Apps",
    path: "/admash/apps/file-manager/",
    icon: <LayersIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "File Manager",
        path: "/admash/apps/file-manager/",
      },
      {
        title: "Chat",
        path: "/admash/apps/chat/",
      },
      {
        title: "To Do",
        path: "/admash/apps/to-do/",
      },
      {
        title: "Calendar",
        path: "/admash/apps/calendar/",
      },
    ],
  },
  {
    title: "Email",
    path: "/admash/email/inbox/",
    icon: <MailOutlineIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Inbox",
        path: "/admash/email/inbox/",
      },
      {
        title: "Read Email",
        path: "/admash/email/read-email/",
      },
    ],
  },
  {
    title: "Contact List",
    path: "/admash/contact-list/",
    icon: <PostAddIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Contact List",
        path: "/admash/contact-list/",
      },
      {
        title: "Members Grid",
        path: "/admash/contact-list/contact-list2/",
      },
      {
        title: "Members List",
        path: "/admash/contact-list/members-list/",
      },
      {
        title: "Profile",
        path: "/admash/contact-list/profile/",
      },
    ],
  },
  {
    title: "Projects",
    path: "/admash/projects/",
    icon: <CopyAllIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Projects",
        path: "/admash/projects/",
      },
      {
        title: "Project Create",
        path: "/admash/projects/project-create/",
      },
      {
        title: "Clients",
        path: "/admash/projects/clients/",
      },
      {
        title: "Team",
        path: "/admash/projects/team/",
      },
      {
        title: "Task",
        path: "/admash/projects/task/",
      },
      {
        title: "User",
        path: "/admash/projects/user/",
      },
      {
        title: "Kanban board",
        path: "/admash/projects/kanban-board/",
      },
    ],
  },
  {
    title: "Analytics",
    path: "/admash/analytics/customers/",
    icon: <AddchartIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Customers",
        path: "/admash/analytics/customers/",
      },
      {
        title: "Reports",
        path: "/admash/analytics/reports/",
      },
    ],
  },
  {
    title: "eCommerce",
    path: "/admash/ecommerce/products/",
    icon: <ShoppingCartCheckoutIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Products",
        path: "/admash/ecommerce/products/",
      },
      {
        title: "Product Details",
        path: "/admash/ecommerce/product-details/",
      },
      {
        title: "Create Product",
        path: "/admash/ecommerce/create-product/",
      },
      {
        title: "Orders List",
        path: "/admash/ecommerce/orders-list/",
      },
      {
        title: "Order Details",
        path: "/admash/ecommerce/order-details/",
      },
      {
        title: "Customers",
        path: "/admash/ecommerce/customers/",
      },
      {
        title: "Cart",
        path: "/admash/ecommerce/cart/",
      },
      {
        title: "Checkout",
        path: "/admash/ecommerce/checkout/",
      },
      {
        title: "Sellers",
        path: "/admash/ecommerce/sellers/",
      },
    ],
  },
  {
    title: "UI Elements",
    path: "/admash/ui-elements/alerts/",
    icon: <ViewQuiltIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Alerts",
        path: "/admash/ui-elements/alerts/",
      },
      {
        title: "Autocomplete",
        path: "/admash/ui-elements/autocomplete/",
      },
      {
        title: "Avatar",
        path: "/admash/ui-elements/avatar/",
      },
      {
        title: "Badge",
        path: "/admash/ui-elements/badge/",
      },
      {
        title: "Buttons",
        path: "/admash/ui-elements/buttons/",
      },
      {
        title: "Cards",
        path: "/admash/ui-elements/cards/",
      },
      {
        title: "Checkbox",
        path: "/admash/ui-elements/checkbox/",
      },
      {
        title: "Swiper Slider",
        path: "/admash/ui-elements/swiper-slider/",
      },
      {
        title: "Radio",
        path: "/admash/ui-elements/radio/",
      },
      {
        title: "Rating",
        path: "/admash/ui-elements/rating/",
      },
      {
        title: "Select",
        path: "/admash/ui-elements/select/",
      },
      {
        title: "Slider",
        path: "/admash/ui-elements/slider/",
      },
      {
        title: "Switch",
        path: "/admash/ui-elements/switch/",
      },
      {
        title: "Chip",
        path: "/admash/ui-elements/chip/",
      },
      {
        title: "List",
        path: "/admash/ui-elements/list/",
      },
      {
        title: "Modal",
        path: "/admash/ui-elements/modal/",
      },
      {
        title: "Table",
        path: "/admash/ui-elements/table/",
      },
      {
        title: "Tooltip",
        path: "/admash/ui-elements/tooltip/",
      },
      {
        title: "Progress",
        path: "/admash/ui-elements/progress/",
      },
      {
        title: "Skeleton",
        path: "/admash/ui-elements/skeleton/",
      },
      {
        title: "Snackbar",
        path: "/admash/ui-elements/snackbar/",
      },
      {
        title: "Accordion",
        path: "/admash/ui-elements/accordion/",
      },
      {
        title: "Pagination",
        path: "/admash/ui-elements/pagination/",
      },
      {
        title: "Stepper",
        path: "/admash/ui-elements/stepper/",
      },
      {
        title: "Tabs",
        path: "/admash/ui-elements/tabs/",
      },
      {
        title: "Image List",
        path: "/admash/ui-elements/image-list/",
      },
      {
        title: "Transitions",
        path: "/admash/ui-elements/transitions/",
      },
    ],
  },
  {
    title: "Forms",
    path: "/admash/forms/form-layouts/",
    icon: <CheckBoxOutlineBlankIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Basic Elements",
        path: "/admash/forms/form-layouts/",
      },
      {
        title: "Advanced Elements",
        path: "/admash/forms/advanced-elements/",
      },
      {
        title: "Editors",
        path: "/admash/forms/editors/",
      },
      {
        title: "File Uploader",
        path: "/admash/forms/file-uploader/",
      },
    ],
  },
  {
    title: "Pages",
    path: "/admash/pages/invoice/",
    icon: <ContentCopyIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Invoice",
        path: "/admash/pages/invoice/",
      },
      {
        title: "Invoice Details",
        path: "/admash/pages/invoice-details/",
      },
      {
        title: "ApexCharts",
        path: "/admash/pages/apexcharts/",
      },
      {
        title: "Recharts",
        path: "/admash/pages/recharts/",
      },
      {
        title: "Profile",
        path: "/admash/pages/profile/",
      },
      {
        title: "Pricing",
        path: "/admash/pages/pricing/",
      },
      {
        title: "Testimonials",
        path: "/admash/pages/testimonials/",
      },
      {
        title: "Timeline",
        path: "/admash/pages/timeline/",
      },
      {
        title: "FAQ",
        path: "/admash/pages/faq/",
      },
      {
        title: "Gallery",
        path: "/admash/pages/gallery/",
      },
      {
        title: "Support",
        path: "/admash/pages/support/",
      },
      {
        title: "Search",
        path: "/admash/pages/search/",
      },
      {
        title: "Material Icons",
        path: "/admash/pages/material-icons/",
      },
      {
        title: "Remixicon",
        path: "/admash/pages/remixicon/",
      },
      {
        title: "Maps",
        path: "/admash/pages/maps/",
      },
      {
        title: "404 Error Page",
        path: "/admash/404/",
      },
      {
        title: "Terms & Conditions",
        path: "/admash/pages/terms-conditions/",
      },
    ],
  },
  {
    title: "Authentication",
    path: "/admash/authentication/sign-in/",
    icon: <LockIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Sign Up",
        path: "/admash/authentication/sign-up/",
      },
      {
        title: "Forgot Password",
        path: "/admash/authentication/forgot-password/",
      },
      {
        title: "Lock Screen",
        path: "/admash/authentication/lock-screen/",
      },
      {
        title: "Confirm Mail",
        path: "/admash/authentication/confirm-mail/",
      },
      {
        title: "Logout",
        path: "/admash/authentication/logout/",
      },
    ],
  },
  {
    title: "Notification",
    path: "/admash/notification/",
    icon: <NotificationsNoneIcon />,
  },
  {
    title: "Settings",
    path: "/admash/settings/account/",
    icon: <SettingsIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Account",
        path: "/admash/settings/account/",
      },
      {
        title: "Security",
        path: "/admash/settings/security/",
      },
      {
        title: "Privacy Policy",
        path: "/admash/settings/privacy-policy/",
      },
      {
        title: "Terms & Conditions",
        path: "/admash/pages/terms-conditions/",
      },
      {
        title: "Logout",
        path: "/admash/authentication/logout/",
      },
    ],
  },
];

