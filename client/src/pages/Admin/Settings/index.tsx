import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, Lock, Bell, Palette } from 'lucide-react';
import { cn } from '../../../utils/cn';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="text-slate-400" size={24} />
          Platform Settings
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Configure global settings for the LMS platform.</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-6">
            <Globe size={20} className="text-blue-400" />
            General Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="LMS Platform"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="support@lmsplatform.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Platform Description</label>
              <textarea 
                rows={3}
                defaultValue="A premium learning management system for modern education."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Financial Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-6">
            <Lock size={20} className="text-amber-400" />
            Financial & Security
          </h2>
          
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Platform Fee (%)</label>
                <input 
                  type="number" 
                  defaultValue="15"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Currency</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                  <option value="bdt">BDT (৳)</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Require Teacher Approval</p>
                <p className="text-xs text-slate-500 mt-0.5">Manually approve teachers before they can publish courses.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
