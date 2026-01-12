'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

interface Farm {
    _id: string;
    name: string;
    location?: string;
    area?: number;
    unit?: string;
    isActive: boolean;
    createdAt: string;
}

export default function FarmsPage() {
    const { token } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [farms, setFarms] = useState<Farm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newFarm, setNewFarm] = useState({ name: '', location: '', area: '' });

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchFarms();
    }, [token]);

    const fetchFarms = async () => {
        try {
            const response = await axios.get('/api/farms', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFarms(response.data.farms || []);
        } catch (error: any) {
            toast.error('Failed to load farms');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFarm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFarm.name.trim()) {
            toast.error('Farm name is required');
            return;
        }

        setIsAdding(true);
        try {
            await axios.post('/api/farms', {
                name: newFarm.name,
                location: newFarm.location,
                area: newFarm.area ? Number(newFarm.area) : undefined,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Farm added successfully!');
            setNewFarm({ name: '', location: '', area: '' });
            setShowAddForm(false);
            fetchFarms();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to add farm');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto w-full px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t.farms.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your farm locations
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t.farms.addFarm}
                    </Button>
                </div>

                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.farms.addFarm}</CardTitle>
                                <CardDescription>Add a new farm location</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddFarm} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="farmName">{t.farms.name}</Label>
                                            <Input
                                                id="farmName"
                                                value={newFarm.name}
                                                onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                                                placeholder="Enter farm name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="farmLocation">{t.farms.location}</Label>
                                            <Input
                                                id="farmLocation"
                                                value={newFarm.location}
                                                onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                                                placeholder="City, Village (optional)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="farmArea">{t.farms.area}</Label>
                                            <Input
                                                id="farmArea"
                                                type="number"
                                                value={newFarm.area}
                                                onChange={(e) => setNewFarm({ ...newFarm, area: e.target.value })}
                                                placeholder="Acres (optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={isAdding}>
                                            {isAdding ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {t.common.add}
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setNewFarm({ name: '', location: '', area: '' });
                                            }}
                                        >
                                            {t.common.cancel}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>All Farms ({farms.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-500">
                                Loading farms...
                            </div>
                        ) : farms.length === 0 ? (
                            <div className="text-center py-12">
                                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">{t.farms.noFarms}</p>
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Farm
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {farms.map((farm, idx) => (
                                    <motion.div
                                        key={farm._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="hover:shadow-md transition-all border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden group">
                                            <CardContent className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                                                        <MapPin className="h-7 w-7 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                            {farm.name}
                                                        </h3>
                                                        {farm.location && (
                                                            <p className="text-sm text-gray-500 font-medium">{farm.location}</p>
                                                        )}
                                                        <div className="flex items-center mt-2 space-x-2">
                                                            {farm.area && (
                                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                                                                    {farm.area} {farm.unit || 'Acres'}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
