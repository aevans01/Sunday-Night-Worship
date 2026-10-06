import { Children, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Modal } from 'react-bootstrap';
export const api = Axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 20000
});
export const errorText = e => typeof e?.response?.data === 'string' ? e.response.data : e?.response?.data?.message || 'We couldn’t complete that request. Please try again.';
export function Page({
  eyebrow = 'HAVEN HEIGHTS',
  title,
  description,
  action,
  children
}) {
  return <section className="portal-page"><header className="portal-heading"><div><Link className="portal-breadcrumb" to="/">Home / Community</Link><p className="portal-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</header>{children}</section>;
}
export function Panel({
  title,
  description,
  children,
  className = ''
}) {
  return <section className={`portal-panel ${className}`}>{title && <header className="portal-panel-heading"><h2>{title}</h2>{description && <p>{description}</p>}</header>}{children}</section>;
}
export function Notice({
  children,
  error = false
}) {
  return Children.toArray(children).some(child => typeof child !== 'string' || child.trim()) ? <div className={`portal-notice ${error ? 'is-error' : ''}`} role={error ? 'alert' : 'status'}>{children}</div> : null;
}
export function Empty({
  title = 'Nothing here yet',
  children
}) {
  return <div className="portal-empty"><span aria-hidden="true">✧</span><h2>{title}</h2><p>{children}</p></div>;
}
export function Field({
  label,
  id,
  help,
  ...props
}) {
  const Tag = props.as === 'textarea' ? 'textarea' : props.as === 'select' ? 'select' : 'input';
  const {
    as,
    children,
    ...rest
  } = props;
  return <div className="portal-field"><label htmlFor={id}>{label}{rest.required && <span aria-hidden="true"> *</span>}</label><Tag id={id} {...rest}>{Tag === 'input' ? undefined : children}</Tag>{help && <small>{help}</small>}</div>;
}
export function useList(path) {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [more, setMore] = useState(false);
  const load = useCallback(async (append = false) => {
    setLoading(true);
    setError('');
    try {
      const {
        data
      } = await api.get(path, {
        params: {
          limit: 100,
          offset: append ? items.length : 0
        }
      });
      if (!Array.isArray(data)) throw new Error('Invalid response');
      setItems(old => append ? [...old, ...data] : data);
      setMore(data.length === 100);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, [path, items.length]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(path, {
      params: {
        limit: 100,
        offset: 0
      }
    }).then(({
      data
    }) => {
      if (!Array.isArray(data)) throw new Error('Invalid response');
      if (active) {
        setItems(data);
        setMore(data.length === 100);
      }
    }).catch(e => active && setError(errorText(e))).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [path]);
  return {
    items,
    setItems,
    loading,
    error,
    more,
    reload: () => load(false),
    loadMore: () => load(true)
  };
}
export function ListStatus({
  list,
  children
}) {
  return <>{list.error && <Notice error>{list.error} <button className="portal-link" onClick={list.reload}>Try again</button></Notice>}{list.loading && <p className="portal-loading" role="status">Loading…</p>}{children}{list.more && <button className="portal-btn secondary" disabled={list.loading} onClick={list.loadMore}>Load more</button>}</>;
}
export function Confirm({
  show,
  title,
  children,
  onCancel,
  onConfirm,
  busy
}) {
  return <Modal show={show} onHide={busy ? undefined : onCancel} centered><Modal.Header><Modal.Title>{title}</Modal.Title></Modal.Header><Modal.Body>{children}</Modal.Body><Modal.Footer><button className="portal-btn secondary" disabled={busy} onClick={onCancel}>Cancel</button><button className="portal-btn danger" disabled={busy} onClick={onConfirm}>{busy ? 'Please wait…' : 'Confirm deletion'}</button></Modal.Footer></Modal>;
}
export function Avatar({
  name = ''
}) {
  return <span className="portal-avatar" aria-hidden="true">{name.trim().slice(0, 1).toUpperCase() || 'H'}</span>;
}
