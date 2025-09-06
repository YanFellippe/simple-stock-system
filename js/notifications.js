// ===== SISTEMA DE NOTIFICAÇÕES PERSONALIZADAS ===== //

class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = new Map();
    this.init();
  }

  init() {
    // Criar container se não existir
    if (!document.querySelector('.notifications-container')) {
      this.container = document.createElement('div');
      this.container.className = 'notifications-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.notifications-container');
    }
  }

  // Função principal para mostrar notificações
  show(message, type = 'info', options = {}) {
    const config = {
      title: this.getDefaultTitle(type),
      duration: 4000,
      closable: true,
      progress: true,
      animation: 'slide',
      ...options
    };

    const notification = this.createNotification(message, type, config);
    this.displayNotification(notification, config);
    
    return notification.id;
  }

  // Criar elemento de notificação
  createNotification(message, type, config) {
    const id = 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = id;
    
    const icon = this.getIcon(type);
    
    notification.innerHTML = `
      <div class="notification-icon">
        ${icon}
      </div>
      <div class="notification-content">
        <div class="notification-title">${config.title}</div>
        <div class="notification-message">${message}</div>
      </div>
      ${config.closable ? `
        <button class="notification-close" onclick="notificationSystem.hide('${id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      ` : ''}
      ${config.progress ? '<div class="notification-progress"></div>' : ''}
    `;

    return { element: notification, id, type, config };
  }

  // Exibir notificação
  displayNotification(notification, config) {
    this.container.appendChild(notification.element);
    this.notifications.set(notification.id, notification);

    // Trigger animação de entrada
    requestAnimationFrame(() => {
      if (config.animation === 'bounce') {
        notification.element.classList.add('bounce');
      }
      notification.element.classList.add('show');
    });

    // Auto-hide após duração especificada
    if (config.duration > 0) {
      setTimeout(() => {
        this.hide(notification.id);
      }, config.duration);
    }

    // Limitar número de notificações visíveis
    this.limitNotifications();
  }

  // Esconder notificação
  hide(id) {
    const notification = this.notifications.get(id);
    if (!notification) return;

    notification.element.classList.add('hide');
    
    setTimeout(() => {
      if (notification.element.parentNode) {
        notification.element.parentNode.removeChild(notification.element);
      }
      this.notifications.delete(id);
    }, 300);
  }

  // Limitar número de notificações
  limitNotifications(max = 5) {
    const notifications = Array.from(this.notifications.values());
    if (notifications.length > max) {
      const oldest = notifications[0];
      this.hide(oldest.id);
    }
  }

  // Obter ícone baseado no tipo
  getIcon(type) {
    const icons = {
      success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22,4 12,14.01 9,11.01"></polyline>
      </svg>`,
      error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
      warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
      info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`
    };
    return icons[type] || icons.info;
  }

  // Obter título padrão baseado no tipo
  getDefaultTitle(type) {
    const titles = {
      success: 'Sucesso!',
      error: 'Erro!',
      warning: 'Atenção!',
      info: 'Informação'
    };
    return titles[type] || titles.info;
  }

  // Métodos de conveniência
  success(message, options = {}) {
    return this.show(message, 'success', { animation: 'bounce', ...options });
  }

  error(message, options = {}) {
    return this.show(message, 'error', { animation: 'shake', duration: 6000, ...options });
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', { duration: 5000, ...options });
  }

  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  // Limpar todas as notificações
  clear() {
    this.notifications.forEach((notification) => {
      this.hide(notification.id);
    });
  }
}

// Instância global
const notificationSystem = new NotificationSystem();

// Função de compatibilidade com código existente
function showAlert(message, type = 'info', options = {}) {
  return notificationSystem.show(message, type, options);
}

// Substituir alert padrão do navegador
function showNotification(message, type = 'info', options = {}) {
  return notificationSystem.show(message, type, options);
}

// Funções de conveniência globais
function showSuccess(message, options = {}) {
  return notificationSystem.success(message, options);
}

function showError(message, options = {}) {
  return notificationSystem.error(message, options);
}

function showWarning(message, options = {}) {
  return notificationSystem.warning(message, options);
}

function showInfo(message, options = {}) {
  return notificationSystem.info(message, options);
}

// Substituir alert nativo (opcional - descomente se quiser)
// window.alert = function(message) {
//   showNotification(message, 'info', { title: 'Alerta' });
// };

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotificationSystem, notificationSystem, showAlert, showNotification };
}