import React, { useState, useEffect } from 'react';
import { CreditCard, Download, ExternalLink, Calendar, CheckCircle, Clock } from 'lucide-react';
import { getMyPayments } from '../../services/paymentApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getMyPayments();
        if (res.success) {
          setPayments(res.data);
        } else {
          toast.error(res.error || 'Failed to fetch payments');
        }
      } catch (error) {
        toast.error('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment History</h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>View your past transactions and download receipts.</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {loading ? (
          <Loader message="Loading payment history..." />
        ) : payments.length === 0 ? (
          <div className="p-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <CreditCard size={28} style={{ color: '#4ade80' }} />
            </div>
            <div>
              <p className="font-semibold text-white mb-1">No payments yet</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>You haven't made any purchases.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <tr>
                  <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Transaction</th>
                  <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Amount</th>
                  <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
                  <th className="px-5 py-4 font-medium text-xs uppercase tracking-wider text-right" style={{ color: 'rgba(255,255,255,0.35)' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{payment.course?.title || 'Unknown Course'}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <Calendar size={12} />
                        {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-white">${payment.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4">
                      {payment.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" 
                          style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                          <CheckCircle size={12} /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" 
                          style={{ background: 'rgba(249,115,22,0.15)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 p-2 rounded-lg transition-all" title="Download Receipt"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
