import React from 'react'
import PlanModal from './PlanModal'

const EditPlanModal = ({
  form,
  onClose,
  onChange,
  onPopularChange,
  onSubmit,
  loading,
  billingCycles,
}) => {
  return (
    <PlanModal
      form={form}
      onClose={onClose}
      onChange={onChange}
      onPopularChange={onPopularChange}
      onSubmit={onSubmit}
      loading={loading}
      isEditing={true}
      billingCycles={billingCycles}
    />
  )
}

export default EditPlanModal
