import { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'
import * as notificacoes from '../services/notificacoes'
import '../styles/tiles.css'

export default function Dashboard({ showAlert }) {
  const { user, logout } = useAuth()
  const [saldos, setSaldos] = useState([])
  const [totalDevendo, setTotalDevendo] = useState(0)
  const [totalRecebendo, setTotalRecebendo] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false)
  const intervaloNotificacoesRef = useRef(null)

  useEffect(() => {
    if (!user?.id) {
      setSaldos([])
      setTotalDevendo(0)
      setTotalRecebendo(0)
      setNotificacoesAtivadas(false)
      setLoading(false)

      if (intervaloNotificacoesRef.current) {
        clearInterval(intervaloNotificacoesRef.current)
        intervaloNotificacoesRef.current = null
      }

      return
    }

    carregarSaldos(user)
    verificarPermissaoNotificacoes(user)

    return () => {
      if (intervaloNotificacoesRef.current) {
        clearInterval(intervaloNotificacoesRef.current)
        intervaloNotificacoesRef.current = null
      }
    }
  }, [user])

  const verificarPermissaoNotificacoes = async (usuario) => {
    if (!('Notification' in window)) {
      setNotificacoesAtivadas(false)
      return
    }

    const permissaoConcedida = Notification.permission === 'granted'
    setNotificacoesAtivadas(permissaoConcedida)

    if (!permissaoConcedida || !usuario?.id) {
      if (intervaloNotificacoesRef.current) {
        clearInterval(intervaloNotificacoesRef.current)
        intervaloNotificacoesRef.current = null
      }
      return
    }

    if (intervaloNotificacoesRef.current) {
      clearInterval(intervaloNotificacoesRef.current)
    }

    intervaloNotificacoesRef.current = notificacoes.agendarVerificacaoDiaria(usuario, supabase)
  }

  const ativarNotificacoes = async () => {
    if (!user?.id) {
      showAlert('Faça login para ativar as notificações.', 'error')
      return
    }

    const permitido = await notificacoes.solicitarPermissao()
    setNotificacoesAtivadas(permitido)
    
    if (!permitido) {
      showAlert('Não foi possível ativar as notificações.', 'error')
      return
    }

    const listaNotificacoes = await notificacoes.verificarCobrancasHoje(user, supabase)

    if (listaNotificacoes.length > 0) {
      listaNotificacoes.forEach(({ titulo, opcoes }) => {
        notificacoes.enviarNotificacao(titulo, opcoes)
      })
      showAlert(`${listaNotificacoes.length} notificação(ões) encontrada(s) para hoje!`, 'success')
    } else {
      showAlert('Notificações ativadas! Você será avisado no dia das cobranças.', 'success')
    }

    if (intervaloNotificacoesRef.current) {
      clearInterval(intervaloNotificacoesRef.current)
    }

    intervaloNotificacoesRef.current = notificacoes.agendarVerificacaoDiaria(user, supabase)
  }

  const testarNotificacao = () => {
    if (!('Notification' in window)) {
      showAlert('Este navegador não suporta notificações.', 'error')
      return
    }

    if (Notification.permission !== 'granted') {
      showAlert('Ative as notificações primeiro para realizar o teste.', 'warning')
      return
    }

    notificacoes.enviarNotificacao('🔔 Teste de notificação', {
      body: 'Se você está vendo esta mensagem, as notificações estão funcionando! 🎉',
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag: 'teste-notificacao',
      requireInteraction: false
    })

    showAlert('Notificação de teste enviada! Verifique o navegador.', 'success')
  }

  const carregarSaldos = async (usuario) => {
    if (!usuario?.id) {
      setSaldos([])
      setTotalDevendo(0)
      setTotalRecebendo(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const [
        { data: divisoes, error: divisoesError },
        { data: streamingsPagos, error: streamingsError }
      ] = await Promise.all([
        supabase
          .from('divisoes')
          .select(`
            *,
            streaming:streamings (
              id,
              nome,
              valor_total,
              pagador_id,
              pagador:users!streamings_pagador_id_fkey (
                id,
                nome
              ),
              divisoes ( id )
            )
          `)
          .eq('user_id', usuario.id),
        supabase
          .from('streamings')
          .select(`
            *,
            divisoes (
              *,
              user:users (
                id,
                nome
              )
            )
          `)
          .eq('pagador_id', usuario.id)
      ])

      if (divisoesError) throw divisoesError
      if (streamingsError) throw streamingsError

      const saldosMap = new Map()
      let totalDevendoAcumulado = 0
      let totalRecebendoAcumulado = 0

      divisoes?.forEach((divisao) => {
        const streaming = divisao.streaming
        if (!streaming) return

        const participantes = (streaming.divisoes?.length || 0) + 1
        const valorTotal = Number(streaming.valor_total) || 0
        const valorPadrao = participantes > 0
          ? valorTotal / participantes
          : 0
        const valorPorPessoa = divisao.valor_personalizado != null
          ? Number(divisao.valor_personalizado)
          : valorPadrao

        if (streaming.pagador_id === usuario.id) {
          return
        }

        const pagador = streaming.pagador || {
          id: streaming.pagador_id,
          nome: 'Pagador'
        }

        if (!saldosMap.has(streaming.pagador_id)) {
          saldosMap.set(streaming.pagador_id, {
            pessoa: pagador,
            valor: 0
          })
        }

        const registro = saldosMap.get(streaming.pagador_id)
        if (!registro.pessoa) {
          registro.pessoa = pagador
        }
        registro.valor -= valorPorPessoa
        totalDevendoAcumulado += valorPorPessoa
      })

      streamingsPagos?.forEach((streaming) => {
        const participantes = (streaming.divisoes?.length || 0) + 1
        const valorTotal = Number(streaming.valor_total) || 0
        const valorPadrao = participantes > 0
          ? valorTotal / participantes
          : 0

        streaming.divisoes?.forEach((divisao) => {
          const userId = divisao.user_id
          const participante = divisao.user || {
            id: userId,
            nome: 'Participante'
          }

          if (!saldosMap.has(userId)) {
            saldosMap.set(userId, {
              pessoa: participante,
              valor: 0
            })
          }

          const valorPorPessoa = divisao.valor_personalizado != null
            ? Number(divisao.valor_personalizado)
            : valorPadrao

          const registro = saldosMap.get(userId)
          if (!registro.pessoa) {
            registro.pessoa = participante
          }
          registro.valor += valorPorPessoa
          totalRecebendoAcumulado += valorPorPessoa
        })
      })

      const saldosOrdenados = Array.from(saldosMap.values())
        .filter((item) => Math.abs(item.valor) > 0.01)
        .sort((a, b) => b.valor - a.valor)

      setSaldos(saldosOrdenados)
      setTotalDevendo(totalDevendoAcumulado)
      setTotalRecebendo(totalRecebendoAcumulado)
    } catch (error) {
      console.error('Erro ao carregar saldos:', error)
      setSaldos([])
      setTotalDevendo(0)
      setTotalRecebendo(0)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container" style={{ padding: 'var(--spacing-xl)' }}>
      Carregando...
    </div>
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div>
          <h1 style={{ 
            fontWeight: 'var(--font-weight-bold)', 
            marginBottom: 'var(--spacing-xs)',
            fontSize: '2.5rem',
            letterSpacing: '-1px'
          }}>
            Olá, {user.nome}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Aqui está um resumo das suas cobranças
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {!notificacoesAtivadas && 'Notification' in window && (
            <button 
              onClick={ativarNotificacoes} 
              className="btn btn--accent btn--small"
              title="Receba lembretes no dia das cobranças"
            >
              🔔 Ativar Notificações
            </button>
          )}
          {notificacoesAtivadas && (
            <button
              onClick={testarNotificacao}
              className="btn btn--secondary btn--small"
              title="Dispara uma notificação de teste"
            >
              🎯 Testar Notificação
            </button>
          )}
          <button onClick={logout} className="btn btn--ghost btn--small">
            Sair
          </button>
        </div>
      </div>

      <div className="tile-grid">
        <div className="tile tile--success">
          <div className="tile__title">Você vai receber</div>
          <div className="tile__value">
            R$ {totalRecebendo.toFixed(2)}
          </div>
        </div>

        <div className="tile tile--danger">
          <div className="tile__title">Você deve pagar</div>
          <div className="tile__value">
            R$ {totalDevendo.toFixed(2)}
          </div>
        </div>

        <div className="tile tile--primary">
          <div className="tile__title">Saldo final</div>
          <div className="tile__value">
            R$ {(totalRecebendo - totalDevendo).toFixed(2)}
          </div>
        </div>

        {notificacoesAtivadas && (
          <div className="tile tile--info">
            <div className="tile__title">🔔 Notificações</div>
            <div className="tile__value" style={{ fontSize: '1rem' }}>
              Ativas
            </div>
          </div>
        )}
      </div>

      <h2 style={{ 
        marginTop: 'var(--spacing-xl)', 
        marginBottom: 'var(--spacing-lg)',
        fontWeight: 'var(--font-weight-light)'
      }}>
        Detalhes por pessoa
      </h2>

      <div className="tile-grid">
        {saldos.map((saldo, index) => (
          <div 
            key={saldo.pessoa.id} 
            className={`tile ${saldo.valor > 0 ? 'tile--green' : 'tile--pink'}`}
          >
            <div className="tile__title">{saldo.pessoa.nome}</div>
            <div className="tile__subtitle">
              {saldo.valor > 0 ? 'deve para você' : 'você deve'}
            </div>
            <div className="tile__value">
              R$ {Math.abs(saldo.valor).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {saldos.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          padding: 'var(--spacing-xl)'
        }}>
          Nenhum streaming cadastrado ainda
        </div>
      )}
    </div>
  )
}
