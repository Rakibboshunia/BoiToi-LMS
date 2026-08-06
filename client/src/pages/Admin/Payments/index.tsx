import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CreditCard, Search, MoreVertical, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { getAdminPayments } from '../../../services/adminApi';
import { cn } from '../../../utils/cn';

const AdminPayments: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: getAdminPayments,
  });

  const payments = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <CreditCard className="text-amber-400" size={24} />
            Payment History
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor all transactions and revenue on the platform.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search payments..." 
            className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-medium">Transaction</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading payments...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-400">Failed to load payments.</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment: any, index: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={payment._id} 
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-200">
                        {payment.transactionId || payment._id.substring(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{payment.student?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{payment.student?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300 line-clamp-1">{payment.course?.title || 'Unknown Course'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <ArrowUpRight size={14} className="text-amber-400" />
                        ${payment.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'completed' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1 w-max">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      ) : payment.status === 'failed' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20 flex items-center gap-1 w-max">
                          <XCircle size={14} /> Failed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20 flex items-center gap-1 w-max">
                          <CheckCircle2 size={14} /> {payment.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPayments;
