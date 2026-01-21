"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  CloudOff,
  RefreshCw,
  Check,
  AlertTriangle,
  WifiOff,
  Link2,
  Unlink,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useCloudOrgId } from "@/store/workshop";

interface CloudSyncPanelProps {
  compact?: boolean;
}

export function CloudSyncPanel({ compact = false }: CloudSyncPanelProps) {
  const {
    isConnected,
    syncStatus,
    lastSyncedAt,
    syncError,
    isDirty,
    isSupabaseAvailable,
    syncNow,
    connectToCloud,
    loadFromCloud,
    disconnectFromCloud,
  } = useCloudSync();

  const cloudOrgId = useCloudOrgId();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [loadOrgId, setLoadOrgId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = async () => {
    if (!orgName.trim()) return;

    setIsSubmitting(true);
    try {
      await connectToCloud(orgName.trim());
      setShowConnectModal(false);
      setOrgName("");
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoad = async () => {
    if (!loadOrgId.trim()) return;

    setIsSubmitting(true);
    try {
      await loadFromCloud(loadOrgId.trim());
      setShowLoadModal(false);
      setLoadOrgId("");
    } catch (error) {
      console.error("Failed to load:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLastSynced = (timestamp: string | null) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-[var(--color-accent-coral)]" />;
      case "offline":
        return <WifiOff className="w-4 h-4 text-[var(--color-text-muted)]" />;
      default:
        return isConnected ? (
          <Cloud className="w-4 h-4 text-[var(--color-accent-teal)]" />
        ) : (
          <CloudOff className="w-4 h-4 text-[var(--color-text-muted)]" />
        );
    }
  };

  const getSyncStatusText = () => {
    if (!isSupabaseAvailable) return "Cloud not configured";

    switch (syncStatus) {
      case "syncing":
        return "Syncing...";
      case "error":
        return "Sync error";
      case "offline":
        return "Offline";
      default:
        if (!isConnected) return "Local only";
        if (isDirty) return "Unsaved changes";
        return "Synced";
    }
  };

  // Compact version for header/sidebar
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (isConnected && syncStatus === "idle") {
              syncNow();
            } else if (!isConnected && isSupabaseAvailable) {
              setShowConnectModal(true);
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          title={getSyncStatusText()}
        >
          {getSyncIcon()}
          <span className="hidden sm:inline">{getSyncStatusText()}</span>
        </button>

        {/* Connect Modal */}
        <ConnectModal
          show={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          orgName={orgName}
          setOrgName={setOrgName}
          onConnect={handleConnect}
          onShowLoad={() => {
            setShowConnectModal(false);
            setShowLoadModal(true);
          }}
          isSubmitting={isSubmitting}
        />

        {/* Load Modal */}
        <LoadModal
          show={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          loadOrgId={loadOrgId}
          setLoadOrgId={setLoadOrgId}
          onLoad={handleLoad}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // Full panel version
  return (
    <div className="p-4 rounded-lg border border-white/[0.08] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          {getSyncIcon()}
          Cloud Sync
        </h3>
        {isConnected && (
          <span className="text-xs text-[var(--color-text-muted)]">
            Last synced: {formatLastSynced(lastSyncedAt)}
          </span>
        )}
      </div>

      {syncError && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/20">
          <p className="text-sm text-[var(--color-accent-coral)]">{syncError}</p>
        </div>
      )}

      {!isSupabaseAvailable ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          Cloud sync is not configured. Your data is saved locally.
        </p>
      ) : isConnected ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-[var(--color-accent-teal)]" />
            <span>Connected to cloud</span>
          </div>

          {cloudOrgId && (
            <div className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-bg)] px-2 py-1 rounded">
              ID: {cloudOrgId}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={syncNow}
              disabled={syncStatus === "syncing" || syncStatus === "offline"}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Sync Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnectFromCloud}
              leftIcon={<Unlink className="w-4 h-4" />}
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            Save your workshop progress to the cloud to access it from any device.
          </p>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowConnectModal(true)}
              leftIcon={<Link2 className="w-4 h-4" />}
            >
              Connect to Cloud
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLoadModal(true)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Load Existing
            </Button>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      <ConnectModal
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        orgName={orgName}
        setOrgName={setOrgName}
        onConnect={handleConnect}
        onShowLoad={() => {
          setShowConnectModal(false);
          setShowLoadModal(true);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Load Modal */}
      <LoadModal
        show={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        loadOrgId={loadOrgId}
        setLoadOrgId={setLoadOrgId}
        onLoad={handleLoad}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

// Connect Modal Component
function ConnectModal({
  show,
  onClose,
  orgName,
  setOrgName,
  onConnect,
  onShowLoad,
  isSubmitting,
}: {
  show: boolean;
  onClose: () => void;
  orgName: string;
  setOrgName: (value: string) => void;
  onConnect: () => void;
  onShowLoad: () => void;
  isSubmitting: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[var(--color-surface)] border border-white/[0.08] rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Connect to Cloud</h3>

            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Create a new cloud workspace to save your workshop progress. You can
              share the ID with your team to collaborate.
            </p>

            <Input
              label="Organization Name"
              placeholder="e.g., Acme Credit Union"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={onConnect}
                disabled={!orgName.trim() || isSubmitting}
                isLoading={isSubmitting}
                className="flex-1"
              >
                Create & Connect
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <button
                onClick={onShowLoad}
                className="text-sm text-[var(--color-accent-teal)] hover:underline"
              >
                Have an existing workshop? Load it instead
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Load Modal Component
function LoadModal({
  show,
  onClose,
  loadOrgId,
  setLoadOrgId,
  onLoad,
  isSubmitting,
}: {
  show: boolean;
  onClose: () => void;
  loadOrgId: string;
  setLoadOrgId: (value: string) => void;
  onLoad: () => void;
  isSubmitting: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[var(--color-surface)] border border-white/[0.08] rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Load Existing Workshop</h3>

            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Enter the organization ID from a previous session to continue where
              you left off.
            </p>

            <Input
              label="Organization ID"
              placeholder="Enter your organization ID"
              value={loadOrgId}
              onChange={(e) => setLoadOrgId(e.target.value)}
              className="mb-4 font-mono"
            />

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={onLoad}
                disabled={!loadOrgId.trim() || isSubmitting}
                isLoading={isSubmitting}
                className="flex-1"
              >
                Load Workshop
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
