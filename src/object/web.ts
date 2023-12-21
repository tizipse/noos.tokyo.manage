export const Targets: Record<string, string> = {
  _blank: '新窗口',
  _self: '本窗口',
};

export const Clients: Record<string, { color: string, label: string }> = {
  pc: {color: '#ABABAB', label: '电脑端'},
  mobile: {color: '#75CD42', label: '移动端'},
}

export const Menus: Record<string, string> = {
  cut: 'CUT',
  styling: 'STYLING',
  spa: 'SPA',
  treatment: 'TREATMENT',
  hair_color: 'HAIR COLOR',
  perm: 'PERM',
  straight_perm: 'STRAIGHT PERM',
};

export const Statuses: Record<string, { color: string, label: string }> = {
  open: {color: '#87d068', label: '开启'},
  close: {color: '#f50', label: '关闭'},
}
