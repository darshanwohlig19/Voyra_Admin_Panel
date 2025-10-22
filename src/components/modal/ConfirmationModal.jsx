import React, { useEffect } from 'react'
import { Box, Flex, Button, Text, Icon } from '@chakra-ui/react'
import { IoMdClose } from 'react-icons/io'
import { FaExclamationTriangle, FaTrash, FaBan } from 'react-icons/fa'

/**
 * Enhanced Confirmation Modal Component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {function} onConfirm - Function to execute on confirmation
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "OK")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} confirmColorScheme - Color scheme for confirm button (default: "red")
 * @param {string} icon - Icon type: "warning", "delete", "block" (default: "warning")
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmColorScheme = 'red',
  icon = 'warning',
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  // Close modal when clicking on overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Get icon based on type
  const getIcon = () => {
    switch (icon) {
      case 'delete':
        return FaTrash
      case 'block':
        return FaBan
      default:
        return FaExclamationTriangle
    }
  }

  // Get icon color based on confirmColorScheme
  const getIconColor = () => {
    switch (confirmColorScheme) {
      case 'red':
        return 'red.500'
      case 'orange':
        return 'orange.500'
      case 'blue':
        return 'blue.500'
      default:
        return 'red.500'
    }
  }

  const IconComponent = getIcon()

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1400"
      onClick={handleOverlayClick}
      animation="fadeIn 0.25s ease-in-out"
      backdropFilter="blur(4px)"
      sx={{
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="dark-lg"
        width="420px"
        maxH="500px"
        overflow="hidden"
        animation="slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        border="1px solid"
        borderColor="gray.200"
        sx={{
          '@keyframes slideIn': {
            from: {
              transform: 'scale(0.9) translateY(-20px)',
              opacity: 0,
            },
            to: {
              transform: 'scale(1) translateY(0)',
              opacity: 1,
            },
          },
        }}
      >
        {/* Header with Close Button */}
        <Flex justify="flex-end" align="center" px={4} pt={4} pb={0}>
          <Box
            as="button"
            onClick={onClose}
            cursor="pointer"
            color="gray.400"
            _hover={{
              color: 'gray.700',
              bg: 'gray.100',
              transform: 'rotate(90deg)',
            }}
            transition="all 0.2s"
            fontSize="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            w="32px"
            h="32px"
          >
            <IoMdClose />
          </Box>
        </Flex>

        {/* Body with Icon and Content */}
        <Flex direction="column" align="center" px={6} pt={2} pb={6} gap={4}>
          {/* Icon and Title in Row */}
          <Flex align="center" gap={3}>
            {/* <Flex
              w="50px"
              h="50px"
              borderRadius="full"
              bg={`${confirmColorScheme}.50`}
              align="center"
              justify="center"
              boxShadow="md"
            >
              <Icon as={IconComponent} fontSize="24px" color={getIconColor()} />
            </Flex> */}

            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.2"
            >
              {title}
            </Text>
          </Flex>

          {/* Message */}
          <Text
            fontSize="md"
            color="gray.600"
            textAlign="center"
            lineHeight="1.6"
            px={2}
          >
            {message}
          </Text>
        </Flex>

        {/* Footer with Buttons */}
        {/* Footer with Buttons */}
        <Flex px={6} pb={6} gap={3}>
          <Button
            variant="outline"
            colorPalette="gray"
            size="lg"
            onClick={onClose}
            flex={1}
            fontWeight="bold"
            borderWidth="2px"
            borderColor="gray.400"
            borderRadius="xl"
            _hover={{
              bg: 'gray.50',
              borderColor: 'gray.400',
              transform: 'translateY(-2px)',
              boxShadow: 'md',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            height="48px"
          >
            {cancelText}
          </Button>
          <Button
            colorPalette={confirmColorScheme}
            size="lg"
            onClick={() => {
              if (onConfirm) {
                onConfirm()
              }
            }}
            flex={1}
            fontWeight="bold"
            borderRadius="xl"
            borderWidth="2px"
            borderColor="gray.400"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'xl',
              borderColor: 'gray.400',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            height="48px"
          >
            {confirmText}
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default ConfirmationModal
