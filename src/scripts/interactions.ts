// Enhance already-readable HTML. Each feature owns its state and fallback.
function setupDialogs() {
  if (typeof HTMLDialogElement === 'undefined') return;
  const dialogs = new Map<string, HTMLDialogElement>();
  let activeTrigger: HTMLElement | null = null;
  document.querySelectorAll<HTMLDetailsElement>('[data-modal-source]').forEach(source => {
    const content = source.querySelector<HTMLElement>('.technical-content');
    const title = content?.querySelector('h2');
    if (!content || !title) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'full-dialog';
    dialog.setAttribute('aria-labelledby', title.id);
    const bar = document.createElement('div');
    bar.className = 'dialog-bar';
    const label = document.createElement('span');
    label.textContent = 'AVOCADO / ' + (source.id === 'early-access' ? 'EARLY ACCESS' : 'TECHNICAL DETAILS');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dialog-close';
    close.textContent = 'Close ×';
    close.autofocus = true;
    close.addEventListener('click', () => dialog.close());
    bar.append(label, close);
    dialog.append(bar, content);
    document.body.append(dialog);
    source.hidden = true;
    dialogs.set(source.id, dialog);
    dialog.addEventListener('close', () => {
      if (document.querySelector('dialog[open]')) return;
      document.body.classList.remove('modal-open');
      activeTrigger?.focus({ preventScroll: true });
      activeTrigger = null;
    });
  });
  const open = (id: string, trigger: HTMLElement | null) => {
    const dialog = dialogs.get(id);
    if (!dialog) return false;
    dialogs.forEach(other => { if (other.open) other.close(); });
    activeTrigger = trigger;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    return true;
  };
  document.addEventListener('click', event => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-dialog]');
    if (!trigger || event.defaultPrevented || !(event instanceof MouseEvent) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (open(trigger.dataset.dialog!, trigger)) event.preventDefault();
  });
  // Direct links to technical content remain usable after progressive enhancement.
  if (location.hash) open(location.hash.slice(1), null);
}

function setupTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach(group => {
    const list = group.querySelector<HTMLElement>('[data-tab-list]');
    const tabs = [...group.querySelectorAll<HTMLAnchorElement>('[data-tab]')];
    const panels = [...group.querySelectorAll<HTMLElement>('[data-tab-panel]')];
    if (!list || !tabs.length || tabs.length !== panels.length) return;
    list.setAttribute('role', 'tablist');
    const select = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(index === i));
        tab.tabIndex = index === i ? 0 : -1;
        panels[i].hidden = index !== i;
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].tabIndex = 0;
      tab.addEventListener('click', event => { event.preventDefault(); select(i); });
      tab.addEventListener('keydown', event => {
        const index = event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
        if (index !== null) { event.preventDefault(); select(index, true); }
      });
    });
    const linked = panels.findIndex(panel => `#${panel.id}` === location.hash);
    select(linked < 0 ? 0 : linked);
  });
}

const motionLayout = matchMedia('(min-width: 1000px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)');

function setupScrollStories() {
  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll<HTMLElement>('[data-scroll-story]').forEach(story => {
    const steps = [...story.querySelectorAll<HTMLElement>('[data-story-step]')];
    const visuals = steps.map(step => step.querySelector<HTMLElement>('[data-story-visual]')!);
    const stage = story.querySelector<HTMLElement>('[data-story-stage]');
    const screen = story.querySelector<HTMLElement>('[data-story-screen]');
    const progress = story.querySelector<HTMLElement>('[data-story-progress]');
    const meter = story.querySelector<HTMLElement>('[data-story-meter]');
    if (!steps.length || !stage || !screen || !progress || !meter || visuals.some(v => !v)) return;
    let observer: IntersectionObserver | null = null;
    const setActive = (index: number) => {
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      visuals.forEach((visual, i) => { visual.hidden = i !== index; });
      progress.textContent = `${String(index + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
      meter.style.width = `${(index + 1) / steps.length * 100}%`;
    };
    const update = () => {
      observer?.disconnect();
      story.classList.toggle('story-enhanced', motionLayout.matches);
      stage.hidden = !motionLayout.matches;
      if (!motionLayout.matches) {
        visuals.forEach((visual, i) => { visual.hidden = false; steps[i].append(visual); });
        return;
      }
      visuals.forEach(visual => screen.append(visual));
      const nearest = steps.reduce((best, step, i) => Math.abs(step.getBoundingClientRect().top - innerHeight * .35) < Math.abs(steps[best].getBoundingClientRect().top - innerHeight * .35) ? i : best, 0);
      setActive(nearest);
      observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (!visible.length) return;
        const closest = visible.reduce((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * .35) < Math.abs(b.boundingClientRect.top - innerHeight * .35) ? a : b);
        setActive(steps.indexOf(closest.target as HTMLElement));
      }, { rootMargin: '-25% 0px -45% 0px', threshold: 0 });
      steps.forEach(step => observer!.observe(step));
    };
    update();
    motionLayout.addEventListener('change', update);
  });
}

function setupContextStories() {
  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll<HTMLElement>('[data-context-story]').forEach(story => {
    const steps = [...story.querySelectorAll<HTMLElement>('[data-context-step]')];
    const chips = [...story.querySelectorAll<HTMLElement>('[data-context-chip]')];
    let observer: IntersectionObserver | null = null;
    const update = () => {
      observer?.disconnect();
      story.classList.toggle('context-enhanced', motionLayout.matches);
      chips.forEach(chip => chip.classList.toggle('is-active', !motionLayout.matches));
      if (!motionLayout.matches) return;
      chips[0]?.classList.add('is-active');
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const index = steps.indexOf(entry.target as HTMLElement);
          chips.forEach((chip, i) => chip.classList.toggle('is-active', i <= index));
        });
      }, { rootMargin: '-20% 0px -40% 0px' });
      steps.forEach(step => observer!.observe(step));
    };
    update();
    motionLayout.addEventListener('change', update);
  });
}

function setupMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
  if (!menu) return;
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
  });
}

setupDialogs();
setupTabs();
setupScrollStories();
setupContextStories();
setupMenu();
