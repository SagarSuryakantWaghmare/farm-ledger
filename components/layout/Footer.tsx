'use client';

import { Sprout } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white">
                                <Sprout size={24} />
                            </div>
                            <span className="text-xl font-bold text-white">FarmLedger</span>
                        </div>
                        <p className="text-sm">
                            Modern farm expense management for the digital age.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">© 2026 FarmLedger. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Twitter</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Facebook</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors text-sm">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
