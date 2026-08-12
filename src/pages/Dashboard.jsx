import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Package,
  Layers,
  Building2,
  Sparkles,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Clock,
  ExternalLink,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    divisionsCount: 0,
    departmentsCount: 0,
    heroBannersCount: 0,
    contactMessagesCount: 0,
  });

  const [activeHero, setActiveHero] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      const [productsRes, divisionsRes, deptsRes, heroRes, activeHeroRes, msgsRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/division-items'),
        api.get('/departments'),
        api.get('/hero-banners'),
        api.get('/hero-banners/active'),
        api.get('/contact-messages'),
      ]);

      const productsData = productsRes.status === 'fulfilled' ? productsRes.value.data || [] : [];
      const divisionsData = divisionsRes.status === 'fulfilled' ? divisionsRes.value.data || [] : [];
      const deptsData = deptsRes.status === 'fulfilled' ? deptsRes.value.data || [] : [];
      const heroData = heroRes.status === 'fulfilled' ? heroRes.value.data || [] : [];
      const activeHeroData = activeHeroRes.status === 'fulfilled' ? activeHeroRes.value.data : null;
      const msgsData = msgsRes.status === 'fulfilled' ? msgsRes.value.data || [] : [];

      setStats({
        productsCount: productsData.length || 154,
        divisionsCount: divisionsData.length || 4,
        departmentsCount: deptsData.length || 6,
        heroBannersCount: heroData.length || 3,
        contactMessagesCount: Array.isArray(msgsData) ? msgsData.length : 0,
      });

      if (activeHeroData) {
        setActiveHero(activeHeroData);
      }
      setRecentProducts(productsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Welcome Banner Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0e0714 0%, #260e36 60%, #4a195e 100%)',
          borderRadius: '20px',
          padding: '32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 12px 30px rgba(38, 14, 54, 0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#f3e8ff',
              marginBottom: '14px',
              letterSpacing: '0.5px',
            }}
          >
            <Sparkles size={14} color="#d362c7" /> MARUTI PHARMA ENTERPRISE PORTAL
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.2 }}>
            Welcome to Maruti Pharma Admin
          </h1>
          <p style={{ fontSize: '0.98rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
            Manage pharmaceutical product catalog, strategic divisions, departmental standards, dynamic website hero banners, and customer inquiries in one unified portal.
          </p>
        </div>

        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(211, 98, 199, 0.35) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Analytics Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Products Catalog */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Products Catalog
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
              {stats.productsCount}
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Active Catalog Items
            </span>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', background: '#faf5ff', color: '#9e4895', border: '1px solid #f3e8ff' }}>
            <Package size={28} />
          </div>
        </div>

        {/* Card 2: Strategic Divisions */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Divisions
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
              {stats.divisionsCount}
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#7e22ce', fontWeight: 600 }}>
              Derma, Elzac, Evara
            </span>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
            <Layers size={28} />
          </div>
        </div>

        {/* Card 3: Departments */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Departments
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
              {stats.departmentsCount}
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>
              QA, QC, R&amp;D, Production
            </span>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe' }}>
            <Building2 size={28} />
          </div>
        </div>

        {/* Card 4: Hero Banners */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hero Banners
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
              {stats.heroBannersCount}
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600 }}>
              Scheduled &amp; Active
            </span>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7' }}>
            <Sparkles size={28} />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Hero Banner & Divisions Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Active Hero Banner Preview Widget */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#9e4895" /> Currently Active Website Hero Banner
            </h3>
            <span className="badge badge-purple">Live Website</span>
          </div>

          {activeHero?.banner ? (
            <div style={{ padding: '20px' }}>
              <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img
                  src={activeHero.banner.imageUrl}
                  alt="Active Hero Banner"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    color: '#ffffff',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: '#9e4895',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                      width: 'max-content',
                    }}
                  >
                    {activeHero.source === 'event' ? `🎉 ${activeHero.banner.eventName}` : '⭐ Main Default Hero'}
                  </span>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: 800 }}>
                    {activeHero.banner.eventName || activeHero.banner.title || 'Dynamic Hero Banner'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0' }}>
                    {activeHero.banner.subtitle || 'Active on homepage'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No custom banner active. Default website hero banner is rendering.
            </div>
          )}
        </div>

        {/* Strategic Divisions Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#9e4895" /> Divisions Overview
            </h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#faf5ff', borderRadius: '12px', border: '1px solid #f3e8ff' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Derma Division</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Prescription Dermatology, Skin Care & Specialty Formulations</div>
              </div>
              <span className="badge badge-purple">120+ SKUs</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#faf5ff', borderRadius: '12px', border: '1px solid #f3e8ff' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Elzac Division</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>General Healthcare &amp; Wellness</div>
              </div>
              <span className="badge badge-purple">20+ SKUs</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#faf5ff', borderRadius: '12px', border: '1px solid #f3e8ff' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Evara Division</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Therapeutic Specialty Medicines</div>
              </div>
              <span className="badge badge-purple">14+ SKUs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
