import { useState } from 'react';
import type { ContactMessage } from '@entities/contactMessage';

interface FormHookOptions {
  onSubmit?: (message: ContactMessage) => Promise<void> | void;
}

export function useFormValidate({ onSubmit }: FormHookOptions = {}) {
  const [status, setStatus] = useState<string>('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const projectType = String(formData.get('ptype') ?? '').trim();
    const industry = String(formData.get('industry') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!name || !email || !projectType || !message) {
      setStatus('Please complete the required fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setStatus('Enter a valid email address.');
      return;
    }

    const payload: ContactMessage = {
      name,
      email,
      projectType,
      industry: industry || undefined,
      message,
    };

    try {
      setPending(true);
      setStatus('Sending...');
      await onSubmit?.(payload);
      setStatus('Thanks! We will reach out within a day.');
      form.reset();
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setPending(false);
    }
  };

  return {
    status,
    pending,
    handleSubmit,
  };
}
