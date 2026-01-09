import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import { base64Decode } from '@shell/utils/crypto';
import { warn } from '../utils/log';
import { AGENT_NAMESPACE, AGENT_NAME, AGENT_CONFIG_SECRET_NAME, PRODUCT_NAME } from '../product';
import { SECRET } from '@shell/config/types';
import { ActionType, Agent, ChatError } from '../types';

/**
 * Composable for managing the AI agent state.
 *
 * The Agent information is used to determine which AI model is being used (shown in the Console panel)
 * and to handle any errors related to the agent's availability or configuration.
 *
 * @returns Composable for managing the AI agent state.
 */
export function useAgentComposable() {
  const store = useStore();
  const t = store.getters['i18n/t'];

  const agent = ref<Agent | null>(null);
  const error = ref<ChatError | null>(null);

  function decodeLLM(ACTIVE_LLM: string): string {
    try {
      return base64Decode(ACTIVE_LLM);
    } catch (error) {
      warn('Error decoding ACTIVE_LLM:', error);
    }

    return '';
  }

  function decodeModel(data: any, activeLLM: string | null) {
    let model = '';

    try {
      if (activeLLM) {
        const modelKey = `${ activeLLM.toUpperCase() }_MODEL`;

        model = base64Decode(data[modelKey] || '');
      }

      if (!model) {
        const { MODEL } = data;

        model = base64Decode(MODEL || '');
      }
    } catch (err) {
      warn(`Error decoding model for ${ activeLLM }:`, err);
    }

    return model;
  }

  function decodeAgentConfigs(data: any): Agent | null {
    let activeLLM = '';
    let activeModel = '';

    const {
      ACTIVE_LLM,
      OLLAMA_URL,
      OPENAI_API_KEY,
      DEEPSEEK_API_KEY,
    } = data;

    if (ACTIVE_LLM) {
      activeLLM = decodeLLM(ACTIVE_LLM);
    } else if (OLLAMA_URL) {
      activeLLM = 'ollama';
    } else if (DEEPSEEK_API_KEY) {
      activeLLM = 'deepseek';
    } else if (OPENAI_API_KEY) {
      activeLLM = 'openai';
    }

    activeModel = decodeModel(data, activeLLM);

    if (activeLLM && activeModel) {
      return {
        name:  t(`ai.agent.models.${ activeLLM }`),
        model: activeModel
      };
    }

    return null;
  }

  async function checkAgentAvailability() {
    // Permission check removed - rely on backend RBAC for access control
    // WebSocket connection will fail if user lacks services/proxy permission
    return true;
  }

  async function getAgentConfigs() {
    // Permission check removed - rely on backend RBAC for access control
    try {
      const secret = await store.dispatch('management/find', {
        type:    SECRET,
        id:      `${ AGENT_NAMESPACE }/${ AGENT_CONFIG_SECRET_NAME }`
      });

      if (secret?.data) {
        agent.value = decodeAgentConfigs(secret.data);
      }
    } catch (e) {
      warn('Error fetching agent configuration secret:', e);
    }

    if (!agent.value) {
      error.value = {
        key:    'ai.error.agent.secret.missingConfig',
        action: {
          label:    t('ai.settings.goToSettings'),
          type:     ActionType.Button,
          resource: { detailLocation: { name: `c-cluster-settings-${ PRODUCT_NAME }` } }
        }
      };
    }
  }

  onMounted(async() => {
    await checkAgentAvailability();
    getAgentConfigs();
  });

  return {
    agent,
    error
  };
}
