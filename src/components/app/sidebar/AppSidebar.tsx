import {
  PocketKnife,
  ChevronsUpDown,
  ChevronDown,
  FileText,
  Fingerprint,
  Hash,
  Mail,
  Shield,
  KeyRound,
  Sparkles,
  SquareTerminal,
  TextCursorInput,
  Type,
  type LucideIcon,
  Search,
  Braces,
  CaseSensitive,
  CodeXml,
  Binary,
  Link,
  Database,
  RefreshCcw,
  Ruler,
  Palette,
  FileCode,
  Calendar,
  SearchCode,
  ImageIcon,
} from "lucide-react"




import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import sidebarConfig from "./sidebar.json"
import { useMemo, useState } from "react"
import { AppInputGroup } from "../input-group/AppInputGroup"

type SidebarNode = {
  name: string
  icon?: string
  description?: string
  path: string
  children?: SidebarNode[]
}

type AppSidebarProps = {
  activePath?: string
  onNavigate?: (path: string) => void
}

const iconMap: Record<string, LucideIcon> = {
  "encode-decode": SquareTerminal,
  base64: Binary,
  hex: Hash,
  jwt: KeyRound,
  formatter: Type,
  url: Link,
  generator: Sparkles,
  password: Shield,
  uuid: Fingerprint,
  "lorem-ipsum": TextCursorInput,
  email: Mail,
  json: Braces,
  case: CaseSensitive,
  xml: CodeXml,
  database: Database,
  converter: RefreshCcw,
  "number-base": Binary,
  unit: Ruler,
  color: Palette,
  "json-yaml": FileCode,
  date: Calendar,
  "text-inspector": SearchCode,
  image: ImageIcon
}

const resolveIcon = (name?: string) => {
  return iconMap[name ?? ""] ?? FileText
}

export function AppSidebar({ activePath = "/", onNavigate = () => undefined }: AppSidebarProps) {

  const [search, setSearch] = useState("")
  const rawModules = useMemo(() => Object.entries(sidebarConfig.modules as Record<string, SidebarNode>), [])
  const rawProjects = useMemo(() => Object.entries(sidebarConfig.projects as Record<string, SidebarNode>), [])

  const filterNodes = (nodes: [string, SidebarNode][], searchTerm: string): [string, SidebarNode & { shouldOpen?: boolean }][] => {
    if (!searchTerm) return nodes

    const term = searchTerm.toLowerCase()

    return nodes
      .map(([key, node]) => {
        if (node.children && node.children.length > 0) {
          const filteredChildren = node.children.filter((child) =>
            child.name.toLowerCase().includes(term)
          )
          
          if (filteredChildren.length > 0) {
            return [key, { ...node, children: filteredChildren, shouldOpen: true }] as [string, SidebarNode & { shouldOpen?: boolean }]
          }
        }

        if (node.name.toLowerCase().includes(term)) {
          return [key, node] as [string, SidebarNode & { shouldOpen?: boolean }]
        }

        return null
      })
      .filter((item): item is [string, SidebarNode & { shouldOpen?: boolean }] => item !== null)
  }

  const filteredModules = useMemo(() => filterNodes(rawModules, search), [rawModules, search])
  const filteredProjects = useMemo(() => filterNodes(rawProjects, search), [rawProjects, search])

  const renderItem = (item: SidebarNode & { shouldOpen?: boolean }, depth = 0) => {
    const Icon = resolveIcon(item.icon)
    const hasChildren = Boolean(item.children?.length)

    if (!hasChildren) {
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            onClick={() => onNavigate(item.path)}
            className={[
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              activePath === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : "",
              depth > 0 ? "pl-6 text-xs" : "",
            ].join(" ")}
          >
            <Icon className="size-4" />
            <span>{item.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuItem key={item.path}>
        <Collapsible 
          className="group/collapsible"
          open={search ? item.shouldOpen : undefined}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={[
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                depth > 0 ? "pl-6 text-xs" : "",
              ].join(" ")}
            >
              <Icon className="size-4" />
              <span>{item.name}</span>
              <ChevronDown className="ml-auto size-4 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-1 space-y-1">
            <SidebarMenu>
              {item.children!.map((child) => {
                const ChildIcon = resolveIcon(child.icon)

                return (
                  <SidebarMenuItem key={child.path}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(child.path)}
                      className={[
                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        activePath === child.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : "",
                        "pl-6 text-xs",
                      ].join(" ")}
                    >
                      <ChildIcon className="size-4" />
                      <span>{child.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              onClick={() => onNavigate("/")}
              className="hover:bg-sidebar-accent active:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                <PocketKnife className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">SwissKnife</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <AppInputGroup 
            placeholder="Search..." 
            icon={<Search />} 
            value={search}
            onChange={setSearch}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 font-medium text-muted-foreground">Modules</SidebarGroupLabel>
          <SidebarMenu>
            {filteredModules.map(([_, item]) => renderItem(item))}
          </SidebarMenu>
        </SidebarGroup>

        {filteredProjects.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 font-medium text-muted-foreground">Projects</SidebarGroupLabel>
            <SidebarMenu>
              {filteredProjects.map(([_, item]) => renderItem(item))}
            </SidebarMenu>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

    </Sidebar>
  )
}