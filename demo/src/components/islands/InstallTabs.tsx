import { useState } from 'react';
import CopyButton from './CopyButton';

const installCommands = [
  { pm: 'npm', cmd: 'npm install layout-inspector' },
  { pm: 'yarn', cmd: 'yarn add layout-inspector' },
  { pm: 'pnpm', cmd: 'pnpm add layout-inspector' },
];

const importStyles = [
  {
    key: 'named',
    label: 'Named',
    code: `import { LayoutInspector } from 'layout-inspector';`,
  },
  {
    key: 'default',
    label: 'Default',
    code: `import LayoutInspector from 'layout-inspector';`,
  },
];

export default function InstallTabs() {
  const [activePm, setActivePm] = useState('npm');
  const [activeImport, setActiveImport] = useState('named');
  const active = installCommands.find((c) => c.pm === activePm) ?? installCommands[0];
  const activeImp = importStyles.find((i) => i.key === activeImport) ?? importStyles[0];
  return (
    <>
      <div className="install-tabs">
        <div className="install-tabs-header">
          {installCommands.map(({ pm }) => (
            <button
              key={pm}
              type="button"
              className={`install-tab ${activePm === pm ? 'install-tab--active' : ''}`}
              onClick={() => setActivePm(pm)}
            >
              {pm}
            </button>
          ))}
        </div>
        <div className="install-tabs-body">
          <code>{active.cmd}</code>
          <CopyButton text={active.cmd} />
        </div>
      </div>

      <div className="install-tabs" style={{ marginTop: 16 }}>
        <div className="install-tabs-header">
          {importStyles.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`install-tab ${activeImport === key ? 'install-tab--active' : ''}`}
              onClick={() => setActiveImport(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="install-tabs-body">
          <code>{activeImp.code}</code>
          <CopyButton text={activeImp.code} />
        </div>
      </div>
    </>
  );
}
