/* const payAllDebt = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formState.loading && user.id && user.balance) {
        setFormState({
            ...formState,
            loading: true,
        });
        try {
            const debt = user.balance;
            const newHistory = user.balanceHistory
                ? [
                      ...user.balanceHistory,
                      {
                          ...debt,
                          date: Timestamp.now(),
                      },
                  ]
                : [
                      {
                          ...debt,
                          date: Timestamp.now(),
                      },
                  ];
            await toast.promise(
                updateUser(user.id, {
                    balance: {
                        amount: 0,
                        currency: "Bs. (BOB)",
                    },
                    balanceHistory: newHistory,
                }),
                {
                    pending: "Estableciendo como deuda cobrada",
                    success: "Deuda cobrada",
                    error: "Error al cobrar toda la deuda",
                },
            );
            window.location.reload();
            setFormState({
                ...formState,
                loading: false,
            });
        } catch (e) {
            setFormState({
                ...formState,
                loading: false,
            });
        }
    }
}; */