import {
  mdiAccountCheck,
  mdiAccountGroup,
  mdiAccountKeyOutline,
  mdiFitToPage,
  mdiFrequentlyAskedQuestions,
  mdiHome,
  mdiFileDocumentEditOutline,
  mdiBitcoin,
  mdiAccountTie,
  mdiCardAccountMailOutline,
  mdiInformation,
  mdiSendVariant,
  mdiWeb,
  mdiWallet,
  mdiGift
} from '@mdi/js'

const SidebarData = [
  { label: 'Menu', children: [{ icon: mdiHome, key: '/' }] },
  {
    label: 'Collections',
    isMainMenu: true,
    children: [
      { icon: mdiAccountGroup, key: 'users' },
      { icon: mdiFrequentlyAskedQuestions, key: 'articles' },
      { icon: mdiFileDocumentEditOutline, key: 'transactions' },
      { icon: mdiWallet, key: 'balances' }
    ]
  },
  {
    label: 'Static Pages',
    isMainMenu: true,
    children: [
      { icon: mdiFitToPage, key: 'static-pages/fit-guide' },
      { icon: mdiInformation, key: 'static-pages/about-us' },
      { icon: mdiCardAccountMailOutline, key: 'static-pages/contact-us' },
      { icon: mdiSendVariant, key: 'static-pages/telegram' },
      { icon: mdiGift, key: 'static-pages/promotion' }
    ]
  },
  {
    label: 'Configuration',
    children: [
      { icon: mdiBitcoin, key: 'tokens' },
      { icon: mdiAccountTie, key: 'owner-users' },
      { icon: mdiWeb, key: 'networks' }
    ]
  },
  {
    label: 'Maintenance',
    children: [
      { icon: mdiAccountCheck, key: 'admin/users', role: 'super-admin' },
      { icon: mdiAccountKeyOutline, key: 'admin/roles', role: 'super-admin' }
    ]
  }
]
export default SidebarData
