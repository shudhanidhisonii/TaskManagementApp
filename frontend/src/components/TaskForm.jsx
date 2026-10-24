import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Loader2, Save } from 'lucide-react';
import { EMPTY_FORM, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/task.js';

const FIELD_NAMES = ['title', 'description', 'status', 'priority', 'dueDate'];

const validate = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Title is required.';
  if (values.dueDate && Number.isNaN(Date.parse(values.dueDate))) {
    errors.dueDate = 'Enter a valid date.';
  }
  return errors;
};

function Field({ name, label, required, error, children }) {
  return (
    <div className="field">
      <label htmlFor={`field-${name}`}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="field__error" id={`error-${name}`}>
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

export default function TaskForm({ initialValues = EMPTY_FORM, submitLabel, onSubmit, cancelTo }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const fieldErrors = {};
      const otherDetails = [];
      (err.details ?? []).forEach((detail) => {
        const field = FIELD_NAMES.find((name) => detail.startsWith(name));
        if (field) fieldErrors[field] = detail;
        else otherDetails.push(detail);
      });
      setErrors(fieldErrors);
      setFormError({ message: err.message, details: otherDetails });
    } finally {
      setSubmitting(false);
    }
  };

  const inputProps = (name) => ({
    id: `field-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    disabled: submitting,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `error-${name}` : undefined,
  });

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="alert" role="alert">
          <AlertCircle size={20} />
          <div>
            <strong>{formError.message}</strong>
            {formError.details.length > 0 && (
              <ul>
                {formError.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <Field name="title" label="Title" required error={errors.title}>
        <input {...inputProps('title')} type="text" className="input" placeholder="e.g. Finish project report" required />
      </Field>

      <Field name="description" label="Description" error={errors.description}>
        <textarea {...inputProps('description')} className="input textarea" rows={4} placeholder="Add some details (optional)" />
      </Field>

      <div className="form__row">
        <Field name="status" label="Status" error={errors.status}>
          <select {...inputProps('status')} className="input">
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field name="priority" label="Priority" error={errors.priority}>
          <select {...inputProps('priority')} className="input">
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field name="dueDate" label="Due date" error={errors.dueDate}>
        <input {...inputProps('dueDate')} type="date" className="input" />
      </Field>

      <div className="form__actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <Link
          to={cancelTo}
          className="btn btn-secondary"
          aria-disabled={submitting}
          onClick={(event) => submitting && event.preventDefault()}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}