/*
 * Copyright (C) 2014 Michael Brown <mbrown@fensystems.co.uk>.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301, USA.
 *
 * You can also choose to distribute this program under the terms of
 * the Unmodified Binary Distribution Licence (as given in the file
 * COPYING.UBDL), provided that you have satisfied its requirements.
 */

FILE_LICENCE ( GPL2_OR_LATER_OR_UBDL );

/** @file
 *
 * 16550-compatible UART
 *
 */

#include <errno.h>
#include <ipxe/uart.h>

/** UART port bases */
static uint16_t uart_base[] = {
	[COM1] = 0x3f8,
	[COM2] = 0x2f8,
	[COM3] = 0x3e8,
	[COM4] = 0x2e8,
};

/**
 * Select UART port
 *
 * @v uart		UART
 * @v port		Port number, or 0 to disable
 * @ret rc		Return status code
 */
int uart_select ( struct uart *uart, unsigned int port ) {

	/* Clear UART base */
	uart->base = NULL;

	/* Set new UART base */
	if ( port < ( sizeof ( uart_base ) / sizeof ( uart_base[0] ) ) ) {
		uart->base = ( ( void * ) ( intptr_t ) uart_base[port] );
		return 0;
	} else {
		return -ENODEV;
	}
}