'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Plus, 
  Minus, 
  Check, 
  Calculator, 
  Smartphone,
  Wrench,
  Shield,
  Zap
} from 'lucide-react';

interface CalculatorItem {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  icon: any;
  description: string;
  category: 'cameras' | 'upgrades' | 'installation' | 'maintenance';
}

const calculatorItems: CalculatorItem[] = [
  // מצלמות
  {
    id: 'camera-basic',
    name: 'מצלמה בסיסית 4MP',
    basePrice: 450,
    unit: 'יחידה',
    icon: Camera,
    description: 'מצלמת IP 4MP עם ראיית לילה',
    category: 'cameras'
  },
  {
    id: 'camera-4k',
    name: 'מצלמה 4K מתקדמת',
    basePrice: 750,
    unit: 'יחידה',
    icon: Camera,
    description: 'מצלמת IP 4K עם זיהוי פנים',
    category: 'cameras'
  },
  {
    id: 'camera-ptz',
    name: 'מצלמה PTZ',
    basePrice: 1200,
    unit: 'יחידה',
    icon: Camera,
    description: 'מצלמה עם יכולת סיבוב וזום',
    category: 'cameras'
  },
  
  // שדרוגים
  {
    id: 'nvr-4ch',
    name: 'NVR 4 ערוצים',
    basePrice: 800,
    unit: 'יחידה',
    icon: Wrench,
    description: 'מקליט וידאו 4 ערוצים + 1TB',
    category: 'upgrades'
  },
  {
    id: 'nvr-8ch',
    name: 'NVR 8 ערוצים',
    basePrice: 1200,
    unit: 'יחידה',
    icon: Wrench,
    description: 'מקליט וידאו 8 ערוצים + 2TB',
    category: 'upgrades'
  },
  {
    id: 'poe-switch',
    name: 'PoE Switch 8 פורטים',
    basePrice: 300,
    unit: 'יחידה',
    icon: Zap,
    description: 'מתג חשמל דרך רשת',
    category: 'upgrades'
  },
  
  // התקנה
  {
    id: 'installation-basic',
    name: 'התקנה בסיסית',
    basePrice: 200,
    unit: 'נקודה',
    icon: Wrench,
    description: 'התקנה עד 20 מטר כבל',
    category: 'installation'
  },
  {
    id: 'installation-complex',
    name: 'התקנה מורכבת',
    basePrice: 350,
    unit: 'נקודה',
    icon: Wrench,
    description: 'קידוח בטון, גובה מעל 3 מטר',
    category: 'installation'
  },
  
  // תחזוקה
  {
    id: 'maintenance-monthly',
    name: 'תחזוקה חודשית',
    basePrice: 99,
    unit: 'חודש',
    icon: Shield,
    description: 'בדיקה ותחזוקה שוטפת',
    category: 'maintenance'
  }
];

const addOns = [
  { name: 'כל מטר כבל מעבר ל-20 מ׳', price: 12, unit: 'מטר' },
  { name: 'קידוח בטון/אבן קשה', price: 120, unit: 'נקודה' },
  { name: 'גובה מעל 3 מ׳', price: 200, unit: 'נקודה' },
  { name: 'UPS קטן ל-NVR', price: 300, unit: 'יחידה' },
  { name: 'מיקרופון/אודיו', price: 200, unit: 'נקודה' }
];

export function PriceCalculator() {
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [selectedAddOns, setSelectedAddOns] = useState<{[key: string]: number}>({});
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    
    // חישוב פריטים עיקריים
    Object.entries(selectedItems).forEach(([itemId, quantity]) => {
      const item = calculatorItems.find(i => i.id === itemId);
      if (item && quantity > 0) {
        total += item.basePrice * quantity;
      }
    });
    
    // חישוב תוספות
    Object.entries(selectedAddOns).forEach(([addOnName, quantity]) => {
      const addOn = addOns.find(a => a.name === addOnName);
      if (addOn && quantity > 0) {
        total += addOn.price * quantity;
      }
    });
    
    return total;
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  const updateAddOnQuantity = (addOnName: string, quantity: number) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addOnName]: Math.max(0, quantity)
    }));
  };

  const getCategoryItems = (category: string) => {
    return calculatorItems.filter(item => item.category === category);
  };

  const getCategoryTotal = (category: string) => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = calculatorItems.find(i => i.id === itemId && i.category === category);
      if (item && quantity > 0) {
        total += item.basePrice * quantity;
      }
      return total;
    }, 0);
  };

  const total = calculateTotal();
  const hasItems = Object.values(selectedItems).some(qty => qty > 0) || 
                   Object.values(selectedAddOns).some(qty => qty > 0);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">מחשבון מחירים</span>
          </h2>
          <p className="text-xl text-aegis-secondary max-w-3xl mx-auto">
            בנה את מערכת האבטחה שלך וקבל הצעת מחיר מדויקת תוך שניות
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* מחשבון */}
          <div className="lg:col-span-2">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-aegis-blue" />
                  בנה את המערכת שלך
                </CardTitle>
                <CardDescription>
                  בחר את הפריטים שאתה צריך וקבל מחיר מדויק
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* מצלמות */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-aegis-blue" />
                    מצלמות אבטחה
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCategoryItems('cameras').map((item) => {
                      const Icon = item.icon;
                      const quantity = selectedItems[item.id] || 0;
                      return (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-aegis-blue/10 rounded-lg">
                                <Icon className="h-5 w-5 text-aegis-blue" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-aegis-secondary">{item.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-aegis-blue">{item.basePrice}₪</div>
                              <div className="text-sm text-aegis-secondary">{item.unit}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, quantity - 1)}
                                disabled={quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <div className="text-sm font-semibold text-aegis-green">
                                {item.basePrice * quantity}₪
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* שדרוגים */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-aegis-blue" />
                    ציוד נוסף ושדרוגים
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCategoryItems('upgrades').map((item) => {
                      const Icon = item.icon;
                      const quantity = selectedItems[item.id] || 0;
                      return (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-aegis-green/10 rounded-lg">
                                <Icon className="h-5 w-5 text-aegis-green" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-aegis-secondary">{item.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-aegis-green">{item.basePrice}₪</div>
                              <div className="text-sm text-aegis-secondary">{item.unit}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, quantity - 1)}
                                disabled={quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <div className="text-sm font-semibold text-aegis-green">
                                {item.basePrice * quantity}₪
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* תוספות */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-aegis-blue" />
                    תוספות אופציונליות
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addOns.map((addOn) => {
                      const quantity = selectedAddOns[addOn.name] || 0;
                      return (
                        <div key={addOn.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{addOn.name}</h4>
                              <p className="text-sm text-aegis-secondary">{addOn.unit}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-aegis-warning">{addOn.price}₪</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAddOnQuantity(addOn.name, quantity - 1)}
                                disabled={quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAddOnQuantity(addOn.name, quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <div className="text-sm font-semibold text-aegis-green">
                                {addOn.price * quantity}₪
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* סיכום מחיר */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-aegis-green" />
                  סיכום מחיר
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {hasItems ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* פירוט לפי קטגוריות */}
                      {['cameras', 'upgrades', 'installation', 'maintenance'].map(category => {
                        const categoryTotal = getCategoryTotal(category);
                        if (categoryTotal === 0) return null;
                        
                        return (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm text-aegis-secondary capitalize">
                              {category === 'cameras' && 'מצלמות'}
                              {category === 'upgrades' && 'ציוד ושדרוגים'}
                              {category === 'installation' && 'התקנה'}
                              {category === 'maintenance' && 'תחזוקה'}
                            </span>
                            <span className="font-semibold">{categoryTotal}₪</span>
                          </div>
                        );
                      })}

                      {/* תוספות */}
                      {Object.entries(selectedAddOns).map(([addOnName, quantity]) => {
                        if (quantity === 0) return null;
                        const addOn = addOns.find(a => a.name === addOnName);
                        if (!addOn) return null;
                        
                        return (
                          <div key={addOnName} className="flex justify-between items-center">
                            <span className="text-sm text-aegis-secondary">{addOnName}</span>
                            <span className="font-semibold">{addOn.price * quantity}₪</span>
                          </div>
                        );
                      })}

                      <Separator />
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>סה"כ</span>
                        <span className="text-aegis-blue">{total.toLocaleString()}₪</span>
                      </div>

                      <div className="space-y-3 pt-4">
                        <Button 
                          className="w-full cta-button" 
                          size="lg"
                          onClick={() => setShowBreakdown(!showBreakdown)}
                        >
                          <Calculator className="h-5 w-5 mr-2" />
                          {showBreakdown ? 'הסתר פירוט' : 'הצג פירוט מלא'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          asChild
                        >
                          <a href="https://wa.me/972559737025" target="_blank" rel="noopener noreferrer">
                            <Smartphone className="h-5 w-5 mr-2" />
                            שלח הצעה ב-WhatsApp
                          </a>
                        </Button>
                      </div>

                      {showBreakdown && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-muted/30 rounded-lg space-y-2"
                        >
                          <h4 className="font-semibold text-sm">מה כלול במחיר:</h4>
                          <ul className="text-xs space-y-1 text-aegis-secondary">
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-aegis-green" />
                              התקנה מקצועית
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-aegis-green" />
                              הדרכה מלאה
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-aegis-green" />
                              אחריות 12 חודשים
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-aegis-green" />
                              תמיכה טכנית
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Calculator className="h-12 w-12 text-aegis-secondary mx-auto mb-4" />
                      <p className="text-aegis-secondary">
                        בחר פריטים כדי לראות את המחיר
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
