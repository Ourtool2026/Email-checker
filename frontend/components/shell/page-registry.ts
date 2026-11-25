import { AlertsPage } from "@/components/pages/alerts-page"
import { AnalyticsPage } from "@/components/pages/analytics-page"
import { AnnouncementsPage } from "@/components/pages/announcements-page"
import { AppControlPage } from "@/components/pages/app-control-page"
import { ApprovalsPage } from "@/components/pages/approvals-page"
import { AuditPage } from "@/components/pages/audit-page"
import { AutomationsPage } from "@/components/pages/automations-page"
import { CalendarPage } from "@/components/pages/calendar-page"
import { CampaignsPage } from "@/components/pages/campaigns-page"
import { CasesPage } from "@/components/pages/cases-page"
import { CommandCenterPage } from "@/components/pages/command-center-page"
import { ContentPage } from "@/components/pages/content-page"
import { ExperimentsPage } from "@/components/pages/experiments-page"
import { FinancePage } from "@/components/pages/finance-page"
import { HostelsPage } from "@/components/pages/hostels-page"
import { IntegrationsPage } from "@/components/pages/integrations-page"
import { LandlordsPage } from "@/components/pages/landlords-page"
import { LawPage } from "@/components/pages/law-page"
import { LevelsPage } from "@/components/pages/levels-page"
import { ListingsPage } from "@/components/pages/listings-page"
import { MapPage } from "@/components/pages/map-page"
import { MarketingPage } from "@/components/pages/marketing-page"
import { OrgPage } from "@/components/pages/org-page"
import { PartnersPage } from "@/components/pages/partners-page"
import { PlansPage } from "@/components/pages/plans-page"
import { PrivacyPage } from "@/components/pages/privacy-page"
import { ReportBuilderPage } from "@/components/pages/report-builder-page"
import { ReportsPage } from "@/components/pages/reports-page"
import { RulesPage } from "@/components/pages/rules-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { StatusPage } from "@/components/pages/status-page"
import { StaysPage } from "@/components/pages/stays-page"
import { SupportPage } from "@/components/pages/support-page"
import { TeamPage } from "@/components/pages/team-page"
import { TechnicalPage } from "@/components/pages/technical-page"
import { TemplatesPage } from "@/components/pages/templates-page"
import { UsersPage } from "@/components/pages/users-page"
import { VerifyPage } from "@/components/pages/verify-page"
import { WorkPage } from "@/components/pages/work-page"

export const pageComponents: Record<string, any> = {
  calendar: CalendarPage,
  announcements: AnnouncementsPage,
  map: MapPage,
  automations: AutomationsPage,
  reportbuilder: ReportBuilderPage,
  org: OrgPage,
  work: WorkPage,
  marketing: MarketingPage,
  finance: FinancePage,
  technical: TechnicalPage,
  command: CommandCenterPage,
  analytics: AnalyticsPage,
  users: UsersPage,
  verify: VerifyPage,
  stays: StaysPage,
  hostels: HostelsPage,
  landlords: LandlordsPage,
  listings: ListingsPage,
  cases: CasesPage,
  reports: ReportsPage,
  alerts: AlertsPage,
  rules: RulesPage,
  law: LawPage,
  approvals: ApprovalsPage,
  privacy: PrivacyPage,
  audit: AuditPage,
  levels: LevelsPage,
  campaigns: CampaignsPage,
  templates: TemplatesPage,
  partners: PartnersPage,
  plans: PlansPage,
  appcontrol: AppControlPage,
  experiments: ExperimentsPage,
  integrations: IntegrationsPage,
  status: StatusPage,
  content: ContentPage,
  support: SupportPage,
  team: TeamPage,
  settings: SettingsPage,
}
