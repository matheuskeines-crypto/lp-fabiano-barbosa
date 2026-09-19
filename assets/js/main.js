/* ==========================================================================
   Fabiano Barbosa — Advocacia e Assessoria Jurídica
   Interações da landing page
   ========================================================================== */
(function () {
  'use strict';

  const header = document.getElementById('header');
  const fab = document.getElementById('fab-whatsapp');
  const progresso = document.getElementById('progresso');
  const menu = document.getElementById('menu-mobile');
  const menuToggle = document.getElementById('menu-toggle');
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  const navLinks = document.querySelectorAll('.nav-link');
  const secoes = document.querySelectorAll('section[id]');

  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Loop de scroll — tudo em um único rAF para manter a rolagem fluida
     ---------------------------------------------------------------------- */
  let ticking = false;
  let ultimoY = window.scrollY;

  function aoRolar() {
    const y = window.scrollY;
    const alturaDoc = document.documentElement.scrollHeight - window.innerHeight;

    /* Header com fundo sólido após sair do topo */
    header.classList.toggle('is-scrolled', y > 24);

    /* Botão flutuante do WhatsApp */
    if (fab) fab.classList.toggle('is-visible', y > 620);

    /* Barra de progresso de leitura */
    if (progresso && alturaDoc > 0) {
      progresso.style.width = Math.min(100, (y / alturaDoc) * 100) + '%';
    }

    /* Parallax das camadas do hero */
    if (!semAnimacao && y < window.innerHeight * 1.5) {
      parallaxEls.forEach(function (el) {
        const fator = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        el.style.transform = 'translate3d(0,' + y * fator + 'px,0)';
      });
    }

    /* Link ativo na navegação */
    let ativo = '';
    secoes.forEach(function (sec) {
      if (y >= sec.offsetTop - 140) ativo = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + ativo);
    });

    ultimoY = y;
    ticking = false;
  }

  function solicitarFrame() {
    if (!ticking) {
      window.requestAnimationFrame(aoRolar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', solicitarFrame, { passive: true });
  window.addEventListener('resize', solicitarFrame, { passive: true });
  aoRolar();

  /* ----------------------------------------------------------------------
     Animação de entrada dos elementos
     ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .img-zoom');

  if ('IntersectionObserver' in window && !semAnimacao) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------------------------
     Menu mobile
     ---------------------------------------------------------------------- */
  function fecharMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-aberto');
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function () {
      const aberto = menu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(aberto));
      menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('menu-aberto', aberto);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharMenu();
    });
  }

  /* ----------------------------------------------------------------------
     FAQ — apenas um item aberto por vez
     ---------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('#faq-list details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ----------------------------------------------------------------------
     Rolagem suave com compensação do header fixo
     ---------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const alvo = document.querySelector(id);
      if (!alvo) return;

      e.preventDefault();
      fecharMenu();
      const topo = alvo.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: topo, behavior: semAnimacao ? 'auto' : 'smooth' });
    });
  });

  /* ----------------------------------------------------------------------
     Brilho que acompanha o cursor nos cards (apenas em mouse)
     ---------------------------------------------------------------------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ----------------------------------------------------------------------
     Ano dinâmico no rodapé
     ---------------------------------------------------------------------- */
  const anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     Rastreio de cliques em CTA (pronto para GA4 / Meta Pixel)
     ---------------------------------------------------------------------- */
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      const origem = el.getAttribute('data-cta');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'clique_whatsapp', { origem: origem });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', { origem: origem });
      }
    });
  });
})();
